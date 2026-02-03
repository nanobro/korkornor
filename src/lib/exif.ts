import exifr from 'exifr';

export async function extractDateFromImage(file: File): Promise<Date | null> {
  try {
    const exifData = await exifr.parse(file, {
      pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate', 'DateTime'],
    });

    if (exifData?.DateTimeOriginal) {
      return new Date(exifData.DateTimeOriginal);
    }
    if (exifData?.CreateDate) {
      return new Date(exifData.CreateDate);
    }
    if (exifData?.DateTime) {
      return new Date(exifData.DateTime);
    }

    return null;
  } catch (error) {
    console.error('Error extracting EXIF:', error);
    return null;
  }
}

export function formatThaiDate(date: Date): string {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}
