import * as geolite2 from 'geolite2-redist';
import maxmind, { CityResponse } from 'maxmind';

const lookupPromise = getLookup();

export async function getLookup() {
  console.log('start getLookup');
  await geolite2.downloadDbs();
  console.log('finish getLookup');
  return geolite2.open<CityResponse>('GeoLite2-City', (path) => {
    return maxmind.open(path);
  });
}

export async function getLocation(ip: string) {
  const lookup = await lookupPromise;
  const city = lookup.get(ip);
  return city;
}
