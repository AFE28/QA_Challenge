export default class ENV {
    // Define a static property 'baseURL' to store the base URL for the application
    // The value of 'baseURL' will be read from the 'baseURL' environment variable in the .env file
    public static baseURL = process.env.baseURL;
    public static detailsURL = process.env.detailsURL;
    public static testIdAttribute = process.env.testIdAttribute;
}
