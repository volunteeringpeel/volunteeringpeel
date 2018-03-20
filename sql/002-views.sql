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
  timediff(
    ifnull(us.end_override, s.end_time),
	ifnull(us.start_override, s.start_time)
  ) as hours,
  s.meals,
  s.notes,
  e.event_id,
  e.name,
  e.address,
  e.transport,
  e.description
  from user_shift us
  join confirm_level c on c.confirm_level_id = us.confirm_level_id
  join vw_shift s on s.shift_id = us.shift_id
  join event e on e.event_id = s.event_id;
