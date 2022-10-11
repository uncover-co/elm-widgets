# elm-widgets

A collection of widgets themed trough [ThemeSpec](https://package.elm-lang.org/packages/uncover-co/elm-theme-spec/latest/).

**Alpha** - This is the alpha version of ElmWidgets. This means this package will be updated faster but breakage is expected. A stable version is yet to be released as `uncover-co/elm-widgets`.

## Setup

ElmWidgets is plug-and-play with whatever styling approach you prefer - elm-css, elm-ui, tailwind, you name it - just insert ElmWidgets globalStyles somewhere in your application html and use any widget directly.

```elm
import W.Button
import ThemeSpec


main : Html msg
main =
    div []
        [ ElmWidgets.globalStyles
        , ThemeSpec.globalProvider lightTheme
        , ...
            W.Button.view []
                { label = "Sir, would you please click me?"
                , onClick = ...
                }
        ]
```
