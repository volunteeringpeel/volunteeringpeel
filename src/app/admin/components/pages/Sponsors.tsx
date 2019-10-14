// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Button, Form } from 'semantic-ui-react';

// Component Imports
import FancyTable from '@app/common/components/FancyTable';

// Controller Imports
import SponsorModal from '@app/admin/controllers/modules/SponsorModal';
import * as _ from 'lodash';

interface SponsorsProps {
  addMessage: (message: VP.Message) => any;
  loading: (status: boolean) => any;
  push: (location: LocationDescriptor) => any;
}

interface SponsorsState {
  sponsors: VP.Sponsor[];
}

export default class Sponsors extends React.Component<
  SponsorsProps & RouteComponentProps<any>,
  SponsorsState
> {
  constructor(props: SponsorsProps & RouteComponentProps<any>) {
    super(props);

    this.state = {
      sponsors: [],
    };
  }

  public componentDidMount() {
    this.refresh();
  }

  public handleDelete = (id: number) => {
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.delete(`/api/sponsor/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.message || error.name,
          more: error.response.data.details || error.message,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.refresh();
        // refresh will call loading(false)
      });
  };

  public refresh() {
    return Promise.resolve(this.props.loading(true))
      .then(() => {
        return axios.get('/api/public/sponsor');
      })
      .then(res => {
        this.setState({ sponsors: res.data.data });
        this.props.loading(false);
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.message,
          more: error.response.data.details,
          severity: 'negative',
        });
      });
  }

  public render() {
    const headerRow = ['Priority', 'Name', 'Website', 'Image', 'Actions'];
    const footerRow = [
      <th colSpan={headerRow.length} key="footer">
        <Button
          size="mini"
          content="Add"
          icon="add"
          onClick={() => this.props.push('/admin/sponsors/-1')}
        />
      </th>,
    ];
    const renderBodyRow = (sponsor: VP.Sponsor, i: number) => ({
      key: `row-${i}`,
      cells: [
        sponsor.priority,
        sponsor.name,
        {
          key: 'website',
          icon: !!sponsor.website ? '' : 'attention',
          content: sponsor.website ? <a href={sponsor.website}>Website</a> : 'Missing',
          warning: !!sponsor.website,
        },
        {
          key: 'image',
          icon: !!sponsor.image ? '' : 'attention',
          content: sponsor.image ? (
            <a href={`/upload/sponsor/${sponsor.image}`}>Image</a>
          ) : (
            'Missing'
          ),
          warning: !!sponsor.image,
        },
        <td key="actions">
          <Button.Group compact size="tiny">
            <Button
              icon="edit"
              content="Edit"
              color="blue"
              onClick={() => this.props.push(`/admin/sponsors/${sponsor.sponsor_id}`)}
            />
            <Button
              icon="trash"
              content="Delete"
              negative
              onClick={() => this.handleDelete(sponsor.sponsor_id)}
            />
          </Button.Group>
        </td>,
      ],
    });
    return (
      <Form>
        <FancyTable
          columnDefs={headerRow}
          renderBodyRow={renderBodyRow}
          tableData={this.state.sponsors}
          footerRow={footerRow}
          filters={[]}
        />
        {this.state.sponsors.length && (
          <Route
            path="/admin/sponsors/:id"
            component={({ match }: RouteComponentProps<any>) => (
              <SponsorModal
                sponsor={
                  +match.params.id < 0
                    ? {
                        sponsor_id: -1,
                        name: '',
                        priority: 100,
                        image: null,
                        website: '',
                      }
                    : _.find(this.state.sponsors, ['sponsor_id', +match.params.id])
                }
                cancel={() => this.props.push('/admin/sponsors')}
                refresh={() => this.refresh()}
              />
            )}
          />
        )}
      </Form>
    );
  }
}
