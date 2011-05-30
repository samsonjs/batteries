// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var DateExt = { format: format };

exports.extendNative = function() {
  require('./ext').extend(Date, DateExt);
};

require('./object-ext').extend(exports, DateExt);

var Weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday'];

var WeekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'];

var MonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                   'Sep', 'Oct', 'Nov', 'Dec'];

function format(d, fmt) {
  return fmt.replace(/%(.)/, function(_, c) {
      switch (c) {
          case 'A': return Weekdays[d.getDay()];
          case 'a': return WeekdaysShort[d.getDay()];
          case 'B': return Months[d.getMonth()];
          case 'b': // fall through
          case 'h': return MonthsShort[d.getMonth()];
          case 'D': return format(d, '%m/%d/%y');
          case 'd': return pad(d.getDate());
          case 'e': return d.getDate();
          case 'F': return format(d, '%Y-%m-%d');
          case 'H': return pad(d.getHours());
          case 'I':
              var hour = d.getHours();
              if (hour == 0) hour = 12;
              else if (hour > 12) hour -= 12;
              return pad(hour);
          case 'k': return pad(d.getHours(), ' ');
          case 'l':
              var hour = d.getHours();
              if (hour == 0) hour = 12;
              else if (hour > 12) hour -= 12;
              return pad(hour, ' ');
          case 'M': return pad(d.getMinutes());
          case 'm': return pad(d.getMonth() + 1);
          case 'n': return '\n';
          case 'p': return d.getHours() < 12 ? 'AM' : 'PM';
          case 'R': return format(d, '%H:%M');
          case 'r': return format(d, '%I:%M:%S %p');
          case 'S': return pad(d.getSeconds());
          case 's': return d.getTime();
          case 'T': return format(d, '%H:%M:%S');
          case 't': return '\t';
          case 'u':
              var day = d.getDay();
              return day == 0 ? 7 : day; // 1 - 7, Monday is first day of the week
          case 'v': return format(d, '%e-%b-%Y');
          case 'w': return d.getDay(); // 0 - 6, Sunday is first day of the week
          case 'Y': return d.getFullYear();
          case 'y':
              var year = d.getYear();
              return year < 100 ? year : year - 100;
          case 'Z':
              var tz = d.toString().match(/\((\w+)\)/);
              return tz && tz[1] || '';
          case 'z':
              var off = d.getTimezoneOffset();
              return (off < 0 ? '-' : '+') + pad(off / 60) + pad(off % 60);
          default: return c;
      }
  });
}

function pad(n, padding) {
    padding = padding || '0';
    return n < 10 ? (padding + n) : n;
}

function month(d) {
  return Months(d.getMonth());
}

function shortMonth(d) {
  return MonthsShort(d.getMonth());
}

function weekday(d) {
  return Weekdays(d.getDay());
}

function shortWeekday(d) {
  return WeekdaysShort(d.getDay());
}
