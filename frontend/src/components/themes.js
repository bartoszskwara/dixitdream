import React from 'react';
import {unstable_createMuiStrictModeTheme as createMuiTheme} from "@material-ui/core";
import SourceSansProBold from 'assets/fonts/source-sans-pro/SourceSansPro-Bold.ttf';
import SourceSansProBlack from 'assets/fonts/source-sans-pro/SourceSansPro-Black.ttf';

const sourceSansFont = {
    fontFamily: 'SourceSansPro-Bold',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    marginTop: -5,
    src: `
        local('SourceSansPro-Bold'),
        url(${SourceSansProBold}) format('woff')
    `
};
const sourceSansBlackFont = {
    fontFamily: 'SourceSansPro-Black',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 700,
    marginTop: -5,
    src: `
        local('SourceSansPro-Black'),
        url(${SourceSansProBlack}) format('woff')
    `
};

export const themes = {
    dark: {
        name: "dark",
        colors: {

            contrast100: "#ffffff",
            contrast500: "#ecf9ff",

            primary100: "#ffcf8b",
            primary500: "#f59d20",
            primary700: "#FF9500",

            secondary: "#707070",

            accent: "#4da87e",

            error: "#ba0000",
        }
    },
    light: {
        name: "light",
        colors: {

            contrast100: "#ffffff",
            contrast500: "#ecf9ff",

            primary50: "#ffe6c2",
            primary100: "#ffcf8b",
            primary400: "#FFB54D",
            primary500: "#f59d20",
            primary700: "#FF9500",

            secondary50: "#b3b3b3",
            secondary100: "#707070",
            secondary700: "#464646",

            accent: "#4da87e",

            error: "#ba0000",
            like: "#D90000",

        }
    }
};

export const muiThemeProvider = ({ colors }) => {
    return createMuiTheme({
        typography: {
            fontFamily: 'SourceSansPro-Bold, Roboto Medium',
            fontSize: 12,
            subtitle1: {
                fontFamily: 'SourceSansPro-Black, Roboto Bold',
                fontSize: 12
            }
        },
        palette: {
            error: {
                main: colors.error
            }
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    '@font-face': [sourceSansFont],
                },
            },
            MuiIconButton: {
                root: {
                    padding: 0
                }
            },
            MuiButton: {
                root: {
                    fontSize: 20
                }
            },
            MuiFormLabel: {
                root: {
                    fontSize: "16px !important",
                    "&$focused": {
                        color: colors.secondary700
                    }
                },
                focused: {},
            },
            MuiFormControl: {
                root: {
                    width: "100%"
                }
            },
            MuiInputBase: {
                root: {
                    width: "100%",
                    boxShadow: `0px 0px 0px 1px ${colors.primary500}`,
                    borderRadius: 4,
                    backgroundColor: colors.contrast100,
                    height: 50,
                    "&$focused": {
                        boxShadow: `0px 0px 0px 2px ${colors.primary500}`
                    },
                    "&$error": {
                        boxShadow: `0px 0px 0px 2px ${colors.error}`
                    },
                },
                input: {
                    padding: "15px 10px",
                    color: colors.secondary700
                },
                focused: {},
                error: {}
            },
            MuiInputLabel: {
                formControl: {
                    position: "relative"
                }
            },
            MuiInput: {
                formControl: {
                    marginTop: "5px !important"
                }
            },
            MuiChip: {
                root: {
                    backgroundColor: colors.primary400,
                    "&:focus": {
                        backgroundColor: `${colors.primary400} !important`
                    }
                },
                label: {
                    color: colors.contrast100,
                    fontSize: 14
                },
                deleteIcon: {
                    fill: colors.primary700,
                    background: colors.contrast100,
                    borderRadius: "50%"
                }
            },
            MuiFormHelperText: {
                root: {
                    fontSize: 10
                }
            },
            MuiAutocomplete: {
                inputRoot: {
                    padding: "0 10px"
                }
            },
            MuiMenuItem: {
                root: {
                    minWidth: 100
                }
            },
            MuiInputAdornment: {
                positionEnd: {
                    marginLeft: 0,
                    marginRight: 10
                }
            }
        },
    });
}

export const ThemeContext = React.createContext(themes.light);