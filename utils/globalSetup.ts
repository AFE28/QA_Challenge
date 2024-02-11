import dotenv from 'dotenv';

const globalSetup = () => {
    // Load the base .env file from the 'config' folder with override enabled
    dotenv.config({
        path: 'config/.env',
        override: true,
    });

    // Check if the 'ENV' environment variable is set (used to specify environment-specific configurations)
    if (process.env.ENV) {
        // Extract the 'folder' part from the 'ENV' value (e.g., 'demo.s1')
        const envValue = process.env.ENV;
        const folder = envValue.split('.')[0];

        // Load the environment-specific .env file from the corresponding folder with override enabled
        dotenv.config({
            path: `config/${folder}/.env.${envValue}`,
            override: true,
        });
    }
};

// Export the global setup function as the default export of this module
export default globalSetup;
