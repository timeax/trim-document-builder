import { createSheet } from 'trim.js';

const colors = {
    themeDark: '#18181a',
    colorLight: '#86878e',
    divider: 'rgb(38, 38, 42)'
}

const vars = {
    padding: '1rem',
}

/**@type {import('trim.js').SheetArgs} */
const utilities = {
    '.container': {
        media() {
            return {
                "screen >= 1024px": {
                    // width: '950px',
                    padding: '0 2.5rem'
                }
            }
        }
    },

    '.d-flex': {
        display: 'flex'
    },
}

const flexBox = {
    display: 'flex',
    flexDirection: 'row',
}

/**@type {import('trim.js').SheetArgs} */
const searchComponent = {
    '.search__input': {
        width: '100%',
        padding: '8px 24px',

        transition: 'transform 250ms ease-in-out',
        fontSize: '12px',
        lineHeight: '13px',

        color: colors.colorLight,
        backgroundColor: '#26262a',
        backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '18px 18px',
        backgroundPosition: '95% center',
        borderRadius: '50px',
        border: `1px solid ${colors.divider}`,
        transition: 'all 250ms ease-in-out',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        '&:focus, &:focus': {
            padding: '10px 8px',
            outline: '0',
            border: '1px solid transparent',
            borderBottom: '1px solid #575756',
            borderRadius: '0',
            backgroundPosition: '100% center',
        },

        '&::placeholder': {
            // color: `rgba(87, 87, 86, 0.8)`,
            // textTransform: 'uppercase',
            letterSpacing: '1px',
        }
    }
}

export const styles = createSheet({
    ...utilities,
    body: {
        background: colors.themeDark,
        color: colors.colorLight,
        margin: '0px',
        display: 'flex',
        height: '100%',
        flexDirection: 'column'
    },

    header: {
        borderBottom: `1px solid ${colors.divider}`,
        '.nav': {
            ...flexBox,
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '.4rem 0'
        }
    },
    '.content-area': {
        flexGrow: '1',
        ...flexBox
    },
    aside: {
        width: '12rem',
        padding: `${vars.padding}`,
        borderRight: `1px solid ${colors.divider}`,
        ...searchComponent
    },

    '.doc-content': {
        padding: vars.padding
    }
});

