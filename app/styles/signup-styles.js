import vars from './vars';

const pagePaddingLarge = vars.spacing.medium.maxi2x;
const pagePadding = vars.spacing.medium.mini2x;

const page = {
    backgroundColor: vars.white
};

const progressBarContainer = {
    marginTop: vars.spacing.small.mini,
    marginHorizontal: vars.spacing.small.mini,
    height: vars.progressBarHeight,
    flexDirection: 'row'
};

const filledProgressBar = {
    flex: 1,
    borderRadius: 8,
    backgroundColor: vars.peerioBlue
};

const emptyProgressBar = {
    flex: 1,
    borderRadius: 8,
    backgroundColor: vars.black12
};

const container = {
    flex: 0,
    paddingHorizontal: pagePadding,
    paddingTop: vars.spacing.huge.midi2x -
        // because container is always below the progressBar in the signup screens
        (progressBarContainer.marginTop + progressBarContainer.height) -
        // smaller distance on smaller phones
        (vars.isDeviceScreenSmall ? vars.spacing.medium.maxi2x : 0)
};

const container2 = {
    paddingHorizontal: pagePadding,
    // align title with the one from signup-step-3
    paddingTop: 68
};

const headerContainer = {
    marginTop: vars.spacing.small.maxi2x,
    marginBottom: vars.spacing.medium.maxi
};

const headerStyle = {
    fontSize: vars.font.size27, // TODO font should be 27, massive = 24
    color: vars.darkBlue,
    marginBottom: vars.spacing.small.midi
};

const headerStyle2 = {
    fontSize: vars.font.size27, // TODO font should be 27, massive = 24
    color: vars.darkBlue,
    marginBottom: vars.spacing.medium.midi
};

const description = {
    fontSize: vars.font.size18,
    color: vars.textBlack87,
    marginBottom: vars.spacing.medium.maxi2x
};

const subTitle = {
    color: vars.textBlack87,
    marginBottom: 0
};

const separator = {
    height: 1,
    backgroundColor: vars.darkBlueDivider12,
    marginVertical: vars.spacing.medium.mini2x
};

const suggestionContainer = {
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    overflow: 'hidden'
};

const suggestionTitle = {
    color: vars.textBlack54,
    marginRight: vars.spacing.small.midi2x
};

export default {
    pagePaddingLarge,
    pagePadding,
    page,
    progressBarContainer,
    filledProgressBar,
    emptyProgressBar,
    container,
    container2,
    headerContainer,
    headerStyle,
    headerStyle2,
    description,
    separator,
    suggestionContainer,
    suggestionTitle,
    subTitle
};
