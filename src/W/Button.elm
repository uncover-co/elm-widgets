module W.Button exposing
    ( view, viewLink
    , disabled, outlined, invisible
    , primary, success, warning, danger, theme
    , rounded, small, fill
    , left, right
    , id, class, htmlAttrs, Attribute
    )

{-|

@docs view, viewLink


# State

@docs disabled, outlined, invisible


# Colors

@docs primary, success, warning, danger, theme


# Styles

@docs rounded, small, fill


# Elements

@docs left, right


# Html

@docs id, class, htmlAttrs, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import ThemeSpec exposing (ThemeSpecColorVars)
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , style : ButtonStyle
    , class : String
    , disabled : Bool
    , small : Bool
    , rounded : Bool
    , fill : Bool
    , left : Maybe (H.Html msg)
    , right : Maybe (H.Html msg)
    , theme : ThemeSpecColorVars
    , htmlAttributes : List (H.Attribute msg)
    }


type ButtonStyle
    = Basic
    | Outlined
    | Invisible


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , style = Basic
    , class = ""
    , disabled = False
    , small = False
    , rounded = False
    , fill = False
    , left = Nothing
    , right = Nothing
    , theme = ThemeSpec.secondary
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


styleClass : ButtonStyle -> String
styleClass s =
    case s of
        Basic ->
            ""

        Outlined ->
            "ew-m-outlined"

        Invisible ->
            "ew-m-invisible"



-- Main


attributes : List (Attribute msg) -> List (H.Attribute msg)
attributes attrs_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    attrs.htmlAttributes
        ++ [ WH.maybeAttr HA.id attrs.id
           , HA.disabled attrs.disabled
           , HA.class "ew ew-focusable ew-btn"
           , HA.class (styleClass attrs.style)
           , HA.class attrs.class
           , HA.classList
                [ ( "ew-m-small", attrs.small )
                , ( "ew-m-rounded", attrs.rounded )
                ]
           , WH.styles
                [ ( "--bg", attrs.theme.bg )
                , ( "--fg", attrs.theme.fgChannels )
                , ( "--aux", attrs.theme.aux )
                , ( "width", WH.stringIf attrs.fill "100%" "auto" )
                ]
           ]


{-| -}
view :
    List (Attribute msg)
    ->
        { label : String
        , onClick : msg
        }
    -> H.Html msg
view attrs props =
    H.button
        (HE.onClick props.onClick :: attributes attrs)
        [ H.text props.label ]


{-| -}
viewLink :
    List (Attribute msg)
    ->
        { label : String
        , href : String
        }
    -> H.Html msg
viewLink attrs props =
    H.a
        (HA.href props.href :: attributes attrs)
        [ H.text props.label ]



-- Attributes


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
primary : Attribute msg
primary =
    Attribute <| \attrs -> { attrs | theme = ThemeSpec.primary }


{-| -}
success : Attribute msg
success =
    Attribute <| \attrs -> { attrs | theme = ThemeSpec.success }


{-| -}
warning : Attribute msg
warning =
    Attribute <| \attrs -> { attrs | theme = ThemeSpec.warning }


{-| -}
danger : Attribute msg
danger =
    Attribute <| \attrs -> { attrs | theme = ThemeSpec.danger }


{-| -}
outlined : Attribute msg
outlined =
    Attribute <| \attrs -> { attrs | style = Outlined }


{-| -}
invisible : Attribute msg
invisible =
    Attribute <| \attrs -> { attrs | style = Invisible }


{-| -}
fill : Attribute msg
fill =
    Attribute <| \attrs -> { attrs | fill = True }


{-| -}
rounded : Attribute msg
rounded =
    Attribute <| \attrs -> { attrs | rounded = True }


{-| -}
small : Attribute msg
small =
    Attribute <| \attrs -> { attrs | small = True }


{-| -}
left : H.Html msg -> Attribute msg
left v =
    Attribute <| \attrs -> { attrs | left = Just v }


{-| -}
right : H.Html msg -> Attribute msg
right v =
    Attribute <| \attrs -> { attrs | right = Just v }


{-| -}
theme : ThemeSpecColorVars -> Attribute msg
theme v =
    Attribute <| \attrs -> { attrs | theme = v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }
