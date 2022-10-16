module W.Notification exposing
    ( Attribute
    , class
    , color
    , danger
    , footer
    , href
    , htmlAttrs
    , icon
    , id
    , onClick
    , onClose
    , primary
    , secondary
    , success
    , view
    , warning
    )

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Theme
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , class : String
    , htmlAttributes : List (H.Attribute msg)
    , icon : Maybe (H.Html msg)
    , footer : Maybe (H.Html msg)
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
    { id = Nothing
    , class = ""
    , htmlAttributes = []
    , icon = Nothing
    , footer = Nothing
    , color = Theme.neutralForeground
    , href = Nothing
    , onClick = Nothing
    , onClose = Nothing
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


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
icon : H.Html msg -> Attribute msg
icon v =
    Attribute <| \attrs -> { attrs | icon = Just v }


{-| -}
footer : H.Html msg -> Attribute msg
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
                ++ [ WH.maybeAttr HA.id attrs.id
                   , HA.class attrs.class
                   , HA.class "ew-m-0 ew-box-border ew-relative ew-text-left"
                   , HA.class "ew-flex ew-gap-6"
                   , HA.class "ew-font-text ew-text-base ew-font-medium"
                   , HA.class "ew-py-4 ew-px-6"
                   , HA.class "ew-bg-base-bg ew-rounded ew-shadow-lg"
                   , HA.class "ew-border ew-border-solid ew-border-base-aux/10 ew-border-px"
                   , HA.style "color" attrs.color
                   ]

        children : List (H.Html msg)
        children =
            [ WH.maybeHtml (\i -> H.div [ HA.class "ew-shrink-0 ew-flex ew-items-center" ] [ i ]) attrs.icon
            , H.div [ HA.class "ew-grow ew-flex ew-flex-col" ]
                [ H.div [] children_
                , WH.maybeHtml (\h -> H.div [ HA.class "ew-text-sm ew-font-normal ew-text-base-aux" ] [ h ]) attrs.footer
                ]
            , WH.maybeHtml
                (\onClose_ ->
                    H.div
                        [ HA.class "ew-shrink-0 ew-flex ew-items-center" ]
                        [ H.button
                            [ HA.class "ew-appearance-none ew-bg-transparent ew-border-0"
                            , HE.onClick onClose_
                            ]
                            [ H.text "X" ]
                        ]
                )
                attrs.onClose
            ]
    in
    case ( attrs.onClick, attrs.href ) of
        ( Just onClick_, _ ) ->
            H.button
                (baseAttrs ++ [ interactiveClass, HE.onClick onClick_ ])
                children

        ( Nothing, Just href_ ) ->
            H.a
                (baseAttrs ++ [ interactiveClass, HA.href href_ ])
                children

        _ ->
            H.div baseAttrs children


interactiveClass : H.Attribute msg
interactiveClass =
    HA.class
        "ew-appearance-none ew-bg-transparent ew-no-underline ew-focusable hover:before:ew-opacity-[0.05]"
