module W.Notification exposing
    ( view
    , icon, footer
    , primary, secondary, success, warning, danger, color
    , href, onClick, onClose
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Content

@docs icon, footer


# Styles

@docs primary, secondary, success, warning, danger, color


# Actions

@docs href, onClick, onClose


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Theme
import W.Button
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { htmlAttributes : List (H.Attribute msg)
    , icon : Maybe (List (H.Html msg))
    , footer : Maybe (List (H.Html msg))
    , color : String
    , href : Maybe String
    , onClick : Maybe msg
    , onClose : Maybe msg
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { htmlAttributes = []
    , icon = Nothing
    , footer = Nothing
    , color = Theme.neutralForeground
    , href = Nothing
    , onClick = Nothing
    , onClose = Nothing
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
onClick : msg -> Attribute msg
onClick v =
    Attribute <| \attrs -> { attrs | onClick = Just v }


{-| -}
onClose : msg -> Attribute msg
onClose v =
    Attribute <| \attrs -> { attrs | onClose = Just v }


{-| -}
href : String -> Attribute msg
href v =
    Attribute <| \attrs -> { attrs | href = Just v }


{-| -}
icon : List (H.Html msg) -> Attribute msg
icon v =
    Attribute <| \attrs -> { attrs | icon = Just v }


{-| -}
footer : List (H.Html msg) -> Attribute msg
footer v =
    Attribute <| \attrs -> { attrs | footer = Just v }


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
primary : Attribute msg
primary =
    Attribute <|
        \attrs ->
            { attrs | color = Theme.primaryForeground }


{-| -}
secondary : Attribute msg
secondary =
    Attribute <|
        \attrs ->
            { attrs | color = Theme.secondaryForeground }


{-| -}
success : Attribute msg
success =
    Attribute <|
        \attrs ->
            { attrs | color = Theme.successForeground }


{-| -}
warning : Attribute msg
warning =
    Attribute <|
        \attrs ->
            { attrs | color = Theme.warningForeground }


{-| -}
danger : Attribute msg
danger =
    Attribute <|
        \attrs ->
            { attrs | color = Theme.dangerForeground }



-- Main


{-| -}
view :
    List (Attribute msg)
    -> List (H.Html msg)
    -> H.Html msg
view attrs_ children_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        baseAttrs : List (H.Attribute msg)
        baseAttrs =
            attrs.htmlAttributes
                ++ [ HA.class "ew-m-0 ew-box-border ew-relative ew-text-left"
                   , HA.class "ew-flex ew-w-full ew-items-center"
                   , HA.class "ew-font-text ew-text-base ew-font-medium"
                   , HA.class "ew-pb-2 ew-pt-3.5 ew-px-6"
                   , HA.class "ew-min-h-[60px]"
                   , HA.class "ew-bg-base-bg ew-rounded-md ew-shadow-lg"
                   , HA.class "ew-border-solid ew-border-base-aux/10 ew-border"
                   , HA.class "before:ew-content-[''] before:ew-block before:ew-rounded"
                   , HA.class "before:ew-absolute before:ew-inset-0 before:ew-bg-current before:ew-opacity-0"
                   , HA.class "after:ew-content-[''] after:ew-block"
                   , HA.class "after:ew-absolute after:ew-top-0 after:ew-inset-x-0 after:ew-rounded-t"
                   , HA.class "after:ew-h-1.5 after:ew-bg-current"
                   , HA.style "color" attrs.color
                   ]

        children : H.Html msg
        children =
            H.div
                [ HA.class "ew-flex ew-gap-6 ew-items-center ew-w-full ew-relative ew-z-10"
                ]
                [ WH.maybeHtml (H.div [ HA.class "ew-shrink-0 ew-flex ew-items-center" ]) attrs.icon
                , H.div
                    [ HA.class "ew-grow ew-flex ew-flex-col" ]
                    [ H.div [] children_
                    , WH.maybeHtml (H.div [ HA.class "ew-text-sm ew-font-normal ew-text-base-aux" ]) attrs.footer
                    ]
                , WH.maybeHtml
                    (\onClose_ ->
                        H.div
                            [ HA.class "ew-shrink-0 ew-flex ew-items-center" ]
                            [ W.Button.view [ W.Button.invisible, W.Button.icon, W.Button.small ]
                                { label = [ H.text "x" ]
                                , onClick = onClose_
                                }
                            ]
                    )
                    attrs.onClose
                ]
    in
    case ( attrs.onClick, attrs.href ) of
        ( Just onClick_, _ ) ->
            H.button
                (baseAttrs ++ [ interactiveClass, HE.onClick onClick_ ])
                [ children ]

        ( Nothing, Just href_ ) ->
            H.a
                (baseAttrs ++ [ interactiveClass, HA.href href_ ])
                [ children ]

        _ ->
            H.div baseAttrs [ children ]


interactiveClass : H.Attribute msg
interactiveClass =
    HA.class
        "ew-appearance-none ew-bg-transparent ew-no-underline ew-focusable hover:before:ew-opacity-[0.05] active:before:ew-opacity-10"
