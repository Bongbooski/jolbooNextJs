import { createTheme, ThemeOptions } from '@mui/material/styles';

interface IThemeOptions extends ThemeOptions {}

export const themeStyles = {
    components: {
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            height: '60px',
          },
          sizeLarge: {
            minWidth: '423px',
            // padding: '8px 42px',
          }
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            marginBottom: '0px',
          }
        }
      },
    },
    
    typography: {
      fontFamily: [
        'GangwonEdu_OTFBoldA',
      ].join(','),
      h3: {
        color: '#367CFF',
      }
    }
}

const typographyTheme = {
    typography: {
      fontFamily: [
        'GangwonEdu_OTFBoldA',
        // 'Pretendard',
        // '-apple-system',
        // 'BlinkMacSystemFont',
        // '"Segoe UI"',
        // 'Roboto',
        // '"Helvetica Neue"',
        // 'Arial',
        // 'sans-serif',
        // '"Apple Color Emoji"',
        // '"Segoe UI Emoji"',
        // '"Segoe UI Symbol"',
      ].join(','),
    //   h1: {
    //     fontFamily: ['Poppins700-AS800', 'Pretendard'].join(','),
    //     fontWeight: 800,
    //     fontSize: '6rem',
    //     color: '#262A37',
    //     letterSpacing: '-0.5px',
    //   },
    //   h2: {
    //     fontFamily: ['Poppins700-AS800', 'Pretendard'].join(','),
    //     fontWeight: 800,
    //     fontSize: '3.75rem',
    //     color: '#262A37',
    //   },
    //   h3: {
    //     fontFamily: ['Poppins700-AS800', 'Pretendard'].join(','),
    //     fontWeight: 800,
    //     fontSize: '3rem',
    //     color: '#262A37',
    //   },
    //   h4: {
    //     fontFamily: ['Poppins700-AS800', 'Pretendard'].join(','),
    //     fontWeight: 800,
    //     fontSize: '2.13rem',
    //     color: '#262A37',
    //   },
    //   h5: {
    //     fontFamily: ['Poppins700-AS800', 'Pretendard'].join(','),
    //     fontWeight: 800,
    //     fontSize: '1.5rem',
    //     color: '#262A37',
    //   },
    //   h6: {
    //     fontFamily: ['Poppins700-AS800', 'Pretendard'].join(','),
    //     fontWeight: 800,
    //     fontSize: '1.25rem',
    //     color: '#262A37',
    //   },
    //   subtitle1: {
    //     fontFamily: ['Poppins500-AS600', 'Pretendard'].join(','),
    //     fontWeight: 600,
    //     fontSize: '1.13rem',
    //     //color: 'text.primary 값을 사용하도록 별도 지정하지 않음'
    //   },
    //   subtitle2: {
    //     fontFamily: ['Poppins500-AS600', 'Pretendard'].join(','),
    //     fontWeight: 600,
    //     fontSize: '1rem',
    //     //color: 'text.primary 값을 사용하도록 별도 지정하지 않음'
    //   },
    //   // body : custom variant
    //   body: {
    //     fontFamily: ['Poppins', 'Pretendard'].join(','),
    //     fontWeight: 400,
    //     fontSize: '1rem',
    //     lineHeight: '2rem',
    //     //color: 'text.primary 값을 사용하도록 별도 지정하지 않음'
    //   },
    //   body1: {
    //     fontFamily: ['Poppins', 'Pretendard'].join(','),
    //     fontWeight: 400,
    //     fontSize: '1rem',
    //     //color: 'text.primary 값을 사용하도록 별도 지정하지 않음'
    //   },
    //   body2: {
    //     fontFamily: ['Poppins', 'Pretendard'].join(','),
    //     fontWeight: 500,
    //     fontSize: '0.88rem',
    //     //color: 'text.primary 값을 사용하도록 별도 지정하지 않음'
    //   },
    //   overline: {
    //     fontFamily: ['Poppins', 'Pretendard'].join(','),
    //     fontWeight: 400,
    //     fontSize: '0.75rem',
    //     textTransform: 'uppercase',
    //     letterSpacing: '1px',
    //     //color: 'text.primary 값을 사용하도록 별도 지정하지 않음'
    //   },
    //   caption: {
    //     fontFamily: ['Poppins', 'Pretendard'].join(','),
    //     fontWeight: 400,
    //     fontSize: '0.75rem',
    //     color: '#5A6172',
    //   },
      // Button, Input, Avatar, Chip, Tooltip 등은 개별 component 설정에서 폰트 설정(weight, size, color 등)
    },
  };

const theme = createTheme(themeStyles as IThemeOptions);

export default theme;