import * as fs from 'fs';
import * as path from 'path';

export default class FileUtils {

    /**
     * Save the data to a local file.
     *
     * @param data - The data to save.
     * @param filePath - The local file path where the content will be saved.
     * @throws Error if there's an issue with creating directories or writing to the file.
     */
    public static async saveDataToFile(data: string, filePath: string): Promise<void> {
        try {
            // Ensure the directory exists or create it if it doesn't
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

            // Write the response content to the specified file
            await fs.promises.writeFile(filePath, data);
        } catch (error) {
            // Handle any errors that may occur during directory creation or file writing
            throw new Error(`Error while saving the data content to file at ${filePath}: ${(error as Error).message}`);
        }
    }
}
