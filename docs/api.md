# Volunteering Peel API Documentation

## Table of Contents

<!-- toc -->

* [Ideology + Structure](#ideology--structure)
* [Endpoint Definitions](#endpoint-definitions)
  * [`/api/public`: Public endpoints](#apipublic-public-endpoints)
    * [`GET /api/public/faq`](#get-apipublicfaq)
    * [`GET /api/public/event`](#get-apipublicevent)
    * [`GET /api/public/execs`](#get-apipublicexecs)
    * [`GET /api/public/sponsors`](#get-apipublicsponsors)
    * [`POST /api/public/mailing-list/:id`](#post-apipublicmailing-listid)
  * [`/api/event`: Event management endpoints](#apievent-event-management-endpoints)
    * [`GET /api/event`](#get-apievent)
    * [`POST /api/event/:id`](#post-apieventid)
    * [`DELETE /api/event/:id`](#delete-apieventid)
  * [`/api/mailing-list`: Mailing list management endpoints](#apimailing-list-mailing-list-management-endpoints)
    * [`GET /api/mailing-list`](#get-apimailing-list)
    * [`POST /api/mailing-list/:id`](#post-apimailing-listid)
    * [`DELETE /api/mailing-list/:id`](#delete-apimailing-listid)
  * [`/api/user`: User management endpoints](#apiuser-user-management-endpoints)
    * [`GET /api/user`](#get-apiuser)
    * [`GET /api/user/current`](#get-apiusercurrent)
    * [`POST /api/user/current`](#post-apiusercurrent)
    * [`POST /api/user/:id`](#post-apiuserid)
    * [`DELETE /api/user/:id`](#delete-apiuserid)

<!-- tocstop -->

## Ideology + Structure

**Note: This is an incomplete set of documentation. Endpoints can and will change faster than docs will update**

A few key points before we begin:

* Endpoints use either a HTTP `GET`, `POST` or `DELETE` to access, update, or delete data, respectively.
* Endpoints all require a `Authorization: Bearer` HTTP header, except for `/api/public/**`.
  * The Bearer token is a JWT web token signed by Auth0 and containing the email address of the currently logged in user.
* Source files are all in the `@api` (`/src/api`) directory
  * Almost all endpoints are defined in `@api/api.ts`, but some are extracted to their own files.

All endpoints will respond with a JSON output.
A successful operation will output as follows:

```ts
{
  status: "success",
  data: any
}
```

A failed operation will respond as follows:

```ts
{
  status: "error",
  error: string,
  details: any
}
```

## Endpoint Definitions

The following definitions each have 3 parts:

* A description of the endpoint
* A definition of the parameters
* A definition of the response (i.e. `response.data`)

### `/api/public`: Public endpoints

This section will cover all publicly available endpoints.
These endpoints **do not** require a JWT authorization token.

#### `GET /api/public/faq`

Get FAQ's.

##### Parameters

None.

##### Response

```ts
{
  status: "success",
  data: Array<{
    question: string, // FAQ question
    answer: string // FAQ response
  }>
}
```

#### `GET /api/public/event`

Get a list of all events. See [`GET /api/event`](#get-apievent).

##### Parameters

None.

##### Response

See [`GET /api/event`](#get-apievent). There are two differences though:

* `data[].active` will not be set.
* `data[].shift.signed_up` will always be `false`, as no signup state can be determined without login.

#### `GET /api/public/execs`

Get a list of current executives.

##### Parameters

None.

##### Response

```ts
{
  status: "success",
  data: Array<{
    user_id: number,
    first_name: string,
    last_name: string,
    title: string,
    bio: string // Biography/about blurb
  }>
}
```

#### `GET /api/public/sponsors`

Get a list of sponsors.

##### Parameters

None.

##### Response

```ts
{
  status: "success",
  data: Array<{
    name: string, // Name
    image: string, // URI of image to show
    website: string // Website to direct to
  }>
}
```

#### `POST /api/public/mailing-list/:id`

Add an email to a mailing list.

##### Parameters

URL parameter `id` indicates the ID of the mailing list to add to

Form data as `application/x-www-form-urlencoded`:

```ts
{
  email: string, // Email to add
}
```

##### Response

Returns success message.

### `/api/event`: Event management endpoints

#### `GET /api/event`

##### Parameters

None

##### Response

```ts
{
  status: "success",
  data: Array<{
    event_id: number, // Event ID
    name: string, // Event name
    address: string, // Event location
    transport: string, // If not null and not empty, pickup/dropoff location
    description: string, // Event description
    active: boolean, // Whether or not to show event on /events page
    shifts: Array<{ // Event shifts
      shift_id: number, // Shift ID. Do not confuse with shift #
      shift_num: number, // Shift # (i.e. Shift 1, Shift 2)
      start_time: string, // ISO start time
      end_time: string, // ISO end time
      hours: string, // Duration in form HH:MM:SS
      meals: Array<string>, // Provided food
      max_spots: number, // Maximum spots available
      spots_taken: number, // People signed up already
      notes: string, // Shift description/notes
      signed_up: boolean // Signed up status (will always be false)
    }>
  }>
}
```

#### `POST /api/event/:id`

Update an event or its shift's details.

##### Parameters

URL parameter `id` indicates ID of event to update.

Form data as `application/x-www-form-urlencoded`:

```ts
{
  name: string, // New event name
  description: string, // New event description
  address: string, // New event location
  transport: string, // New event pickup location (or null for no transport)
  active: boolean, // Show event on /events?
  shifts: Array<{ // Data of new shifts
    shift_id: number, // Old shift ID
    shift_num: number, // New shift # (i.e. Shift 1, Shift 2)
    start_time: string, // New ISO start time
    end_time: string, // New ISO end time
    meals: Array<string>, // New provided food
    max_spots: number, // New maximum spots
  }>,
  deleteShifts: Array<number> // ID's of shifts that were removed
}
```

##### Response

Returns success message.

#### `DELETE /api/event/:id`

Delete an event.

##### Parameters

URL parameter `id` indicates ID of event to delete.

##### Response

Returns success message.

### `/api/mailing-list`: Mailing list management endpoints

#### `GET /api/mailing-list`

##### Parameters

None

##### Response

```ts
{
  status: "success",
  data: Array<{
    mail_list_id: number, // Numeric ID
    display_name: string, // Short human-readable name
    description: string, // Short(ish) description
    members: Array<{ // Emails on list
      first_name: string, // Name if provided, otherwise null
      last_name: string, // Name if provided, otherwise null
      email: string, // Email address
    }>,
  }>
}
```

#### `POST /api/mailing-list/:id`

Update a mailing list's details.

##### Parameters

URL parameter `id` indicates ID of event to update.

Form data as `application/x-www-form-urlencoded`:

```ts
{
  display_name: string, // New display name
  description: string // New description
}
```

##### Response

Returns success message.

#### `DELETE /api/mailing-list/:id`

Delete a mailing list.

##### Parameters

URL parameter `id` indicates ID of mailing list to delete.

##### Response

Returns success message.

### `/api/user`: User management endpoints

#### `GET /api/user`

Retrieve data on all users.

##### Parameters

None.

##### Response

#### `GET /api/user/current`

Retrieve data on the current user

##### Parameters

None.

##### Response

```ts
{
  status: "success",
  data: {
    user: { // User details
      first_name: string, // Real first name
      last_name: string, // Real last name
      email: string, // Email address
      phone_1: string, // Primary contact number
      phone_2: string, // Secondary contact number
      role_id: number, // 1 = Volunteer, 2 = Organizer, 3 = Executive
      title: string, // For execs, e.g. "Chair"
      bio: string // For execs, blurb on exec page
    },
    userShifts: Array<{
      user_shift_id: number, // Signup ID
      hours: string, // Calculated or overwritten number of hours
      confirmLevel: { // Status (signup, complete, ditched, etc.)
        id: number, // Level ID (id > 0 = positive, id < 0 = negative)
        name: string, // Human-readable ID (e.g. "Complete")
        description: string // Human-readable description (e.g. "This shift has been recorded and completed")
      },
      shift: { // Shift details
        shift_id: number, // Shift ID
        shift_num: number, // Shift # (e.g. "Shift 2")
        start_time: string, // Shift start time in ISO format
        end_time: string, // Shift end time in ISO format
        meals: string[], // Provided food (e.g. ['lunch', 'dinner'])
        notes: string, // Shift notes
      },
      parentEvent: { // Event which shift belongs to
        event_id: number, // Event ID
        name: number // Event name
      }
    }>,
    new: boolean // New user flag
  }
}
```

#### `POST /api/user/current`

Update the current user's details

##### Parameters

Form data as `application/x-www-form-urlencoded`:

```ts
{
  first_name: string, // Name
  last_name: string, // Name
  phone_1: string, // Primary phone number
  phone_2: string, // Secondary phone number
  mail_lists: Array<{ // List of subscribed mailing lists
    mail_list_id: number // ID of mailing list
  }>,
  title: string, // For execs only, title
  bio: string // For execs only, bio blurb
}
```

##### Response

Returns success message.

#### `POST /api/user/:id`

Update a user's details.

##### Parameters

URL parameter `id` indicates ID of event to update.

Form data as `application/x-www-form-urlencoded`:

```ts
{
  first_name: string, // New first name
  last_name: string, // New last name
  email: string, // New email address
  phone_1: string, // New primary phone number
  phone_2: string, // New secondary phone number
  mail_lists: Array<{ // List of subscribed mailing lists
    mail_list_id: number // ID of mailing list
  }>,
  role_id: number, // New role
  title: string, // For execs only, new title
  bio: string // For execs only, new bio blurb
}
```

##### Response

Returns success message.

#### `DELETE /api/user/:id`

Delete a user.

##### Parameters

URL parameter `id` indicates ID of mailing list to delete.

##### Response

Returns success message.
