create or replace view vw_mail_list
as
select
  m.mail_list_id,
  m.display_name,
  m.description,
  count(uml.user_mail_list_id) signed_up
  from mail_list m
  left join user_mail_list uml on uml.mail_list_id = m.mail_list_id
  group by 1, 2, 3;

create or replace view vw_user_mail_list
as
select
  m.mail_list_id,
  m.display_name,
  m.description,
  u.first_name,
  u.last_name,
  u.email
  from mail_list m
  left join user_mail_list uml on uml.mail_list_id = m.mail_list_id
  left join user u on u.user_id = uml.user_id;

create or replace view vw_shift
as
select
  s.shift_id,
  s.event_id,
  s.shift_num,
  s.start_time,
  s.end_time,
  timediff(s.end_time, s.start_time) as hours,
  s.meals,
  s.max_spots,
  sum(case when us.shift_id is null then 0 else 1 end) as spots_taken,
  s.notes
  from shift s
  left join user_shift us on us.shift_id = s.shift_id
  group by 1, 2, 3, 4, 5, 6, 7, 8, 10;
  
create or replace view vw_user_shift
as
select
  us.user_shift_id,
  us.confirm_level_id,
  c.name confirm_level,
  c.description confirm_description,
  us.user_id,
  s.shift_id,
  s.shift_num,
  ifnull(us.start_override, s.start_time) as start_time,
  ifnull(us.end_override, s.end_time) as end_time,
  us.hours_override,
  us.assigned_exec,
  addtime(
    timediff(
      ifnull(us.end_override, s.end_time),
      ifnull(us.start_override, s.start_time)
    ),
    ifnull(us.hours_override, "00:00:00")
  ) as hours,
  os.other_shifts,
  s.meals,
  s.notes,
  e.event_id,
  e.name,
  e.address,
  e.transport,
  e.description,
  e.letter,
  us.add_info
  from user_shift us
  join confirm_level c on c.confirm_level_id = us.confirm_level_id
  join vw_shift s on s.shift_id = us.shift_id
  join event e on e.event_id = s.event_id
  join user ae on ae.user_id = us.assigned_exec
  join (
    select
      group_concat(s2.shift_num separator ', ') other_shifts, us2.user_id, s2.event_id
      from user_shift us2
      join vw_shift s2 on s2.shift_id = us2.shift_id
      group by user_id, event_id
  ) os on os.user_id = us.user_id and os.event_id = e.event_id;
