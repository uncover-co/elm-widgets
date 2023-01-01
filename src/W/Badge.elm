module W.Badge exposing
    ( view, viewInline
    , neutral, primary, secondary, success, warning, color, background
    , small
    , htmlAttrs, noAttr, Attribute
    )

{-| Badges are commonly used to display notifications.

@docs view, viewInline


# Colors

By default, badges appear in a **danger** color.

@docs neutral, primary, secondary, success, warning, color, background


# Styles

@docs small


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Theme



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { htmlAttributes : List (H.Attribute msg)
    , small : Bool
    , color : String
    , background : String
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { htmlAttributes = []
    , small = False
    , color = Theme.dangerAux
    , background = Theme.dangerBackground
    }



-- Attributes : Setters


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity


{-| -}
small : Attribute msg
small =
    Attribute <| \attrs -> { attrs | small = True }


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
background : String -> Attribute msg
background v =
    Attribute <| \attrs -> { attrs | background = v }


{-| -}
neutral : Attribute msg
neutral =
    Attribute <|
        \attrs ->
            { attrs
                | background = Theme.neutralBackground
                , color = Theme.neutralAux
            }


{-| -}
primary : Attribute msg
primary =
    Attribute <|
        \attrs ->
            { attrs
                | background = Theme.primaryBackground
                , color = Theme.primaryAux
            }


{-| -}
secondary : Attribute msg
secondary =
    Attribute <|
        \attrs ->
            { attrs
                | background = Theme.secondaryBackground
                , color = Theme.secondaryAux
            }


{-| -}
success : Attribute msg
success =
    Attribute <|
        \attrs ->
            { attrs
                | background = Theme.successBackground
                , color = Theme.successAux
            }


{-| -}
warning : Attribute msg
warning =
    Attribute <|
        \attrs ->
            { attrs
                | background = Theme.warningBackground
                , color = Theme.warningAux
            }



-- Main


{-|

    W.Badge.view []
        { -- number of unread messages
          content = Just [ H.text "9" ]
        , -- call to action
          children =
            [ W.Button.viewLink []
                { href = "/messages"
                , label = [ H.text "Messages" ]
                }
            ]
        }

-}
view :
    List (Attribute msg)
    ->
        { content : Maybe (List (H.Html msg))
        , children : List (H.Html msg)
        }
    -> H.Html msg
view attrs_ props =
    let
        badge : H.Html msg
        badge =
            case props.content of
                Just content ->
                    let
                        attrs : Attributes msg
                        attrs =
                            applyAttrs attrs_
                    in
                    H.span
                        (baseAttrs attrs
                            ++ [ HA.class "ew-absolute ew-bottom-full ew-left-full"
                               , HA.class "-ew-mb-2.5 -ew-ml-2.5"
                               , HA.class "ew-animate-fade-slide"
                               ]
                        )
                        content

                Nothing ->
                    H.text ""
    in
    H.span []
        [ H.span
            [ HA.class "ew-relative" ]
            (badge :: props.children)
        ]


{-|

    W.Badge.viewInline [] [ H.text "9" ]

-}
viewInline : List (Attribute msg) -> List (H.Html msg) -> H.Html msg
viewInline attrs_ value =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.span (baseAttrs attrs) value


baseAttrs : Attributes msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ HA.class "ew-rounded-full"
           , HA.class "ew-leading-none ew-font-semibold ew-font-text"
           , HA.class "ew-border ew-border-solid ew-border-base-bg"
           , HA.style "color" attrs.color
           , HA.style "background" attrs.background
           , HA.classList
                [ ( "ew-px-2.5 ew-py-1 ew-text-sm", not attrs.small )
                , ( "ew-px-1.5 ew-py-0.5 ew-text-xs", attrs.small )
                ]
           ]
