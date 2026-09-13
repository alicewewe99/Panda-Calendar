import { CalendarDayMark, DayInfo } from '../types/calendar';

/**
 * Generates an RFC 5545 compliant .ics (iCalendar) file string
 * which can be opened directly by iPhone (Apple Calendar), Android (Google Calendar), Outlook, etc.
 */
export function exportToICS(
  year: number,
  monthMarks: Record<string, CalendarDayMark>,
  monthDays: DayInfo[]
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alice Panda Monthly Calendar//ZH-TW',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:愛麗絲貓熊童話月曆 ${year}`,
    'X-WR-TIMEZONE:Asia/Taipei',
  ];

  // Helper to format date as YYYYMMDD
  const formatICSDate = (dateStr: string): string => {
    return dateStr.replace(/-/g, '');
  };

  // Export all marked events
  Object.entries(monthMarks).forEach(([dateStr, mark]) => {
    if ((mark.stamps && mark.stamps.length > 0) || mark.notes) {
      const stampStr = mark.stamps.join(' ');
      const summary = stampStr ? `【貓熊標記】${stampStr} ${mark.notes || ''}` : mark.notes || '童話行事曆標記';
      const cleanDate = formatICSDate(dateStr);
      
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:panda-${cleanDate}-${Date.now()}@alice-panda-calendar`);
      lines.push(`DTSTAMP:${cleanDate}T000000Z`);
      lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      lines.push(`DTEND;VALUE=DATE:${cleanDate}`);
      lines.push(`SUMMARY:${summary.trim()}`);
      lines.push(`DESCRIPTION:${mark.notes ? `備忘筆記: ${mark.notes}\\n` : ''}愛麗絲貓熊童話月曆記錄標記: ${stampStr}`);
      lines.push('STATUS:CONFIRMED');
      lines.push('TRANSP:TRANSPARENT');
      lines.push('END:VEVENT');
    }
  });

  // Also include statutory Taiwan holidays for the year
  monthDays.forEach(day => {
    if (day.isNationalHoliday && day.taiwanHoliday) {
      const cleanDate = formatICSDate(day.dateStr);
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:holiday-${cleanDate}@alice-panda-calendar`);
      lines.push(`DTSTAMP:${cleanDate}T000000Z`);
      lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      lines.push(`DTEND;VALUE=DATE:${cleanDate}`);
      lines.push(`SUMMARY:【國定假日】${day.taiwanHoliday}`);
      lines.push(`DESCRIPTION:中華民國行政院人事行政總處最新公告行事曆 - ${day.taiwanHoliday}`);
      lines.push('STATUS:CONFIRMED');
      lines.push('TRANSP:TRANSPARENT');
      lines.push('END:VEVENT');
    }
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Downloads text as a file in browser
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse .ics file text and extract events mapped by YYYY-MM-DD
 */
export function parseICS(icsText: string): Record<string, CalendarDayMark> {
  const result: Record<string, CalendarDayMark> = {};
  const events = icsText.split('BEGIN:VEVENT');

  for (let i = 1; i < events.length; i++) {
    const block = events[i].split('END:VEVENT')[0];
    
    // Extract DTSTART
    const dtStartMatch = block.match(/DTSTART(?:;[^:]+)?:(\d{8})/);
    const summaryMatch = block.match(/SUMMARY:(.*?)(\r?\n[A-Z]|\r?\n$)/s);
    const descMatch = block.match(/DESCRIPTION:(.*?)(\r?\n[A-Z]|\r?\n$)/s);

    if (dtStartMatch) {
      const rawDate = dtStartMatch[1]; // YYYYMMDD
      const year = rawDate.substring(0, 4);
      const month = rawDate.substring(4, 6);
      const day = rawDate.substring(6, 8);
      const dateStr = `${year}-${month}-${day}`;

      const summary = summaryMatch ? summaryMatch[1].trim() : '匯入行程';
      const notes = descMatch ? descMatch[1].trim() : summary;

      if (!result[dateStr]) {
        result[dateStr] = {
          date: dateStr,
          stamps: ['⭐'],
          notes: summary,
        };
      } else {
        result[dateStr].notes = (result[dateStr].notes ? result[dateStr].notes + '\n' : '') + summary;
      }
    }
  }

  return result;
}
