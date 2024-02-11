import fs from 'fs';
import { parse } from 'csv-parse/sync';

export interface CarsDetails {
    carName: string;
    modelYear: string;
    VIN: string;
    FuelType: string;
}

export class CarsUtil {
    getCarDetails(carName: string): CarsDetails[] {
        const cars = parse(fs.readFileSync('test-data/ExplorePage/CarInfoDetails.csv'), {
            columns: true,
            skip_empty_lines: true,
        });

        const carDetails = cars.filter((record: { carName: string }) => record.carName === carName);
        return carDetails;
    }
}
