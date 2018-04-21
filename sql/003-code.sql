delimiter $$

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