
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExtendedPrayerTime, TimeRange } from "@/lib/types";
import { PrayerExportButtons } from "./PrayerExportButtons";
import { getPrayerTitle } from "@/lib/prayer-utils";
import { usePrayerTimesQuery } from "@/hooks/usePrayerTimesQuery";

interface PrayerTableProps {
  timeRange: TimeRange;
  lang: 'tr' | 'de';
  latitude?: number;
  longitude?: number;
}

export const PrayerTable = ({ timeRange, lang, latitude, longitude }: PrayerTableProps) => {
  const { data: prayerTimes, isLoading } = usePrayerTimesQuery({ 
    timeRange, 
    latitude, 
    longitude 
  });

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold text-white/90">{getPrayerTitle(timeRange, lang)}</h2>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead className="text-white/70">{lang === 'tr' ? 'Tarih' : 'Datum'}</TableHead>
                <TableHead className="text-white/70">Imsak</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Güneş' : 'Sonne'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Öğle' : 'Mittag'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'İkindi' : 'Nachmittag'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Akşam' : 'Abend'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Yatsı' : 'Nacht'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prayerTimes && prayerTimes.map((prayer) => (
                <TableRow key={prayer.date} className="hover:bg-white/5">
                  <TableCell className="text-white/90">{prayer.date}</TableCell>
                  <TableCell className="text-white/90">{prayer.fajr}</TableCell>
                  <TableCell className="text-white/90">{prayer.sunrise}</TableCell>
                  <TableCell className="text-white/90">{prayer.dhuhr}</TableCell>
                  <TableCell className="text-white/90">{prayer.asr}</TableCell>
                  <TableCell className="text-white/90">{prayer.maghrib}</TableCell>
                  <TableCell className="text-white/90">{prayer.isha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PrayerExportButtons prayerTimes={prayerTimes} lang={lang} />
      </div>
    </div>
  );
};

