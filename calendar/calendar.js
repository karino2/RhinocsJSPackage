(function (root) {
  const LAST_DAY_OF_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // 先頭は1マスあける。Todayの*のためにその前提で統一
  const TITLE_COLUMN = 1+4+2+2+2; // " YYYY年MM月"の幅
  const MONTH_COLUMN = 14+7; // " 日 月 火 水 木 金 土"の幅
  const MARGIN_COLUMN = 2; // 月の間は2マス
  const MONTH_PER_LINE = 3; // 一行あたり3つの月を並べる
  const MONTH_ROW = 1+1+6; // タイトル、曜日、最大6週。

  function gregorianLeapYearP(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
  }

  function gregorianLastDayOfMonth(year, month) {
    if (month === 2 && gregorianLeapYearP(year)) return 29;
    return LAST_DAY_OF_MONTH[month];
  }

  function jdFromUT(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const a = Math.trunc(year / 100);
    const b = Math.trunc(a / 4) - a + 2;

    return Math.trunc(365.25 * (year + 4716))
      + Math.trunc(30.6001 * (month + 1))
      + day
      + b
      - 1524;
  }

  function utDay(year, month, day) {
    return (1 + jdFromUT(year, month, day)) % 7;
  }

  function titleString(year, month) {
    const yearStr = `${year}年`.padStart(5, ' ');
    const monthStr = `${month}月`.padStart(3, ' ');
    return `${yearStr}${monthStr}`;
  }

  function buildMonthCalendar(year, month, today = null) {
    const startWeekday = utDay(year, month, 1);
    const lastDay = gregorianLastDayOfMonth(year, month);

    const weeks = [];
    let current = [];

    for (let i = 0; i < startWeekday; i += 1) {
      current.push(null);
    }

    for (let day = 1; day <= lastDay; day += 1) {
      current.push({
        day,
        isToday: today !== null && today.year === year && today.month === month && today.day === day,
      });

      if (current.length === 7) {
        weeks.push(current);
        current = [];
      }
    }

    if (current.length > 0) {
      while (current.length < 7) current.push(null);
      weeks.push(current);
    }

    return {
      year,
      month,
      title: titleString(year, month),
      weekday: startWeekday,
      lastDay,
      weeks,
    };
  }

  function buildCalendar(year, month, nMonths = 1, today = null) {
    const months = [];
    for (let i = 0; i < nMonths; i += 1) {
      months.push(buildMonthCalendar(year, month, today));
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
    return months;
  }

  function formatMonthLine(month) {
    let lines = [];
    let title = ' ' + month.title + ' '.repeat(MONTH_COLUMN - TITLE_COLUMN);
    lines.push(title);
    lines.push(' 日 月 火 水 木 金 土');
    month.weeks.forEach((week) => {
        let line = [];
        week.forEach((day) => {
          if (!day) {
            line.push('   ');
            return;
          }

          let dayStr = String(day.day);
          if (day.isToday) {
            if(dayStr.length == 1) {
                line.push(' *');
            } else {
                line.push('*');
            }
            line.push(dayStr);
          } else {
            line.push(" ");
            line.push(dayStr.padStart(2, ' '));
          }
        });
        lines.push(line.join(''));
    });
    return lines;
  }

  // monthsはMONTH_PER_LINE個以下。
  // 一つの行に3つの月が並ぶようにinsertしていく。
  function printMonthsRow(months) {
    for (let row = 0; row < MONTH_ROW; row++) {
      for (let [index, month] of months.entries()) {
        let pad = index === 0 ? '' : ' '.repeat(MARGIN_COLUMN);
        insert(pad);

        if (row >= month.length) {
          insert(' '.repeat(MONTH_COLUMN));
        } else {
          insert(month[row]);
        }
      }
      insert("\n");
    }
  }

  function printMonths(months) {
    // monthsを3つずつ取り出してprintMonthsRowを呼ぶ。最後は端数でも良い。
    for (let i = 0; i < months.length; i += MONTH_PER_LINE) {
      printMonthsRow(months.slice(i, i + MONTH_PER_LINE));
      insert("\n");
    }
  }


  function calendarPrint(year, month, nMonths = 1, y = new Date().getFullYear(), m = new Date().getMonth() + 1, d = new Date().getDate()) {
    const calendars = buildCalendar(year, month, nMonths, { year: y, month: m, day: d });
    const months = calendars.map(formatMonthLine);

    const buf = get_buffer_create('*Calendar*');
    set_buffer(buf);
    delete_region(0, point_max());

    printMonths(months);
    goto_char(0);
  }

  function calendar() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();

    if (arguments.length > 0) {
      return calendarPrint(arguments[0], 1, 12, y, m, d);
    }

    return calendarPrint(y, m, 18, y, m, d);
  }

  root.calendar = calendar;

})(typeof globalThis !== 'undefined' ? globalThis : this);
