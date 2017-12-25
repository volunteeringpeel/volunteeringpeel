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