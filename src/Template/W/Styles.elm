module Template.W.Styles exposing (globalStyles, baseTheme)

{-| You will need both globalStyles and a theme to get started with elm-widgets.

    view : List (Html msg)
    view =
        [ W.Styles.globalStyles
        , W.Styles.baseTheme

        -- ... your application views
        ]


# Custom Themes

elm-widgets is fully compatible with [elm-theme](https://package.elm-lang.org/packages/uncover-co/elm-theme/latest/). So you can use that package to create and expose new themes to your application.

e.g. This would create a dark-mode ready application based on the user system's settings.

    import Theme
    import W.Styles

    view : List (Html msg)
    view =
        [ W.Styles.globalStyles
        , Theme.globalProviderWithDarkMode
            { light = Theme.lightTheme
            , dark = Theme.darkTheme
            , strategy = Theme.systemStrategy
            }

        -- ... your application views
        ]


# API

@docs globalStyles, baseTheme

-}

import Html as H
import Theme


{-| -}
baseTheme : H.Html msg
baseTheme =
    Theme.globalProvider Theme.lightTheme


{-| -}
globalStyles : H.Html msg
globalStyles =
    H.node "style"
        []
        [ H.text <| Debug.todo "STYLES" ]
