# Personality Quiz 2 Template to Actions Builder Migration

This project contains the source code for [Personality Quiz 2](https://developers.google.com/assistant/templates/personality-quiz2) template to [Actions Builder](https://developers.google.com/assistant/conversational/build) migration.

## Directory Structure

| Directory | Description                            |
| --------- | -------------------------------------- |
| canvas    | Interactive Canvas web app source code |
| converter | Sheets and locales conversion tool     |
| functions | Fulfillment webhook source code        |
| sdk       | Action SDK resource files              |

## Prerequisites

1. Node.js and NPM
   - We recommend installing using [nvm for Linux/Mac](https://github.com/creationix/nvm) and [nvm-windows for Windows](https://github.com/coreybutler/nvm-windows)
   - Webhook runtime requires Node.js 10

2. Install the [Firebase CLI](https://developers.google.com/assistant/actions/dialogflow/deploy-fulfillment)
   - We recommend using MAJOR version `8` , `npm install -g firebase-tools@^8.0.0`
   - Run `firebase login` with your Google account

3. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions)
   - Extract the package to a location of your choice and add the binary to your environment's PATH variable. Alternatively, extract the package to a location that's already in your PATH variable (for example, /usr/local/bin)

## Setup

### Create a New Project in Actions Console

1. From the [Actions on Google Console](https://console.actions.google.com/), **New project** > **Create project** > under **What kind of Action do you want to build?** > **Game** > **Blank project for smart display**
   - To find your Project ID: In the Actions Console console for your project, navigate to ⋮ > Project settings > Project ID

### Sheets and Locale Conversion Tool

1. Navigate to `converter/` directory by running `cd converter` from the root directory of this project
2. Go to [Google Sheet Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs), generate a `credentials.json` from step 1 and save it in `converter/` directory
3. Run `npm install`
4. Open `converter/index.js` and update LOCALE_TO_SHEET_ID mapping with your own Personality Quiz 2 data sheet ID for the specific locale you want to convert
   - Uncomment the specific locales you wish to convert
   - The sheet IDs provided in `converter/index.js` are the default sample sheets for each locale. To create a brand new personality quiz 2 action, make a copy of the sample sheet and update your own data
   - Sheet ID can be located in the sheet URL: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit#gid=0`
   - Verify the data sheet is shared with viewer access by clicking on the **Share** button in Google Sheet console and change the Get Link access to *Anyone on the internet with this link can view*
5. Run `npm run convert -- --project_id <PROJECT_ID>`
   - On the initial run, the script will ask you grant read access to your sheets by visiting a URL and copy the authorization code back
   - Sheet data should be added to `functions/data/` directory and locale specific data should be added to `sdk/` directory

### Firebase Hosting Deployment for Interactive Canvas

1. Navigate to `canvas/` directory by running `cd canvas` from the root directory of this project
2. Run `npm install`
3. Run `npm run build`
4. Run `firebase deploy --project <PROJECT_ID> --only hosting` to deploy the canvas web app to Firebase Hosting
   - After releasing a version of the action, to update your canvas web app and test your changes without affecting your production action, we recommend deploying to a [different site](https://support.google.com/firebase/answer/9095420?hl=en) within your Firebase Hosting (e.g. v2-<PROJECT_ID>.web.app)
   - Be aware that you also need to adjust the **IMMERSIVE_URL** in `functions/config.js` for a new webhook to point to the updated canvas web app hosting URL

### Firebase Functions Deployment for Webhook

1. Navigate to `functions/` directory by running `cd functions` from the root directory of this project
2. Run `npm install`
3. Run `firebase deploy --project <PROJECT_ID> --only functions:personalityQuiz_v1` to deploy v1 webhook.
   - After releasing a version of the action, to update you webhook and test your changes without affecting your production action, we recommend deploying to a new webhook URL (e.g. personalityQuiz_v2) by update the **FUNCTION_VERSION** in `functions/config.js`

### Actions CLI

1. Navigate to `sdk/` directory by running `cd sdk` from the root directory of this project
2. Run `gactions login` to login to your account
3. Run `gactions push` to push your project
   - If you need to sync the changes made in Actions Builder console with your local `sdk/` directory, run `gactions pull`
4. Run `gactions deploy preview` to deploy your project to preview environment

### Running this Sample

- You can test your Action on any Google Assistant-enabled device on which the Assistant is signed into the same account used to create this project.
- You can also use the Actions on Google Console simulator to test most features and preview on-device behavior.

## References & Issues

- Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google) or the [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/).
- For bugs, please report an issue on Github.
- Actions on Google [Documentation](https://developers.google.com/assistant)
- Actions on Google [Codelabs](https://codelabs.developers.google.com/?cat=Assistant)

## Contributing

Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
