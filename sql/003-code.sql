delimiter $$

drop trigger if exists user_shift_bi$$
create trigger user_shift_bi before insert
  on user_shift
    for each row begin
		if new.assigned_exec is null then
      select count(*) into @execs from user where role_id = 3 and show_exec = 1;
      set @exec = floor(1 + (rand() * @execs));
      select e.user_id into @assigned_exec from (
        select 
          (@row_number := @row_number + 1) as num, user_id
          from user u, (select @row_number := 0) as t
          where role_id = 3 and show_exec = 1
      ) as e
      where e.num = @exec;
      set new.assigned_exec = @assigned_exec;
    end if;
	end$$

drop trigger if exists user_shift_bu$$
create trigger user_shift_bu before update
  on user_shift
    for each row begin
		select start_time, end_time into @start_time, @end_time from shift where shift_id = new.shift_id;
		if (new.start_override = @start_time) then
			set new.start_override = null;
		end if;
        if (new.end_override = @end_time) then
			set new.end_override = null;
		end if;
	end$$

delimiter ;