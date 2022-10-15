module W.Badge exposing
    ( background
    , class
    , color
    , htmlAttrs
    , id
    , neutral
    , primary
    , secondary
    , success
    , view
    , viewInline
    , warning
    )

import Html as H
import Html.Attributes as HA
import Theme



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , class : String
    , htmlAttributes : List (H.Attribute msg)
    , color : String
    , background : String
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , class = ""
    , htmlAttributes = []
    , color = Theme.dangerAux
    , background = Theme.dangerBackground
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


view :
    List (Attribute msg)
    ->
        { value : Maybe (List (H.Html msg))
        , children : List (H.Html msg)
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        badge : H.Html msg
        badge =
            case props.value of
                Just value ->
                    H.span
                        (baseAttrs attrs
                            ++ [ HA.class "ew-absolute ew-bottom-full ew-left-full"
                               , HA.class "-ew-mb-2.5 -ew-ml-2.5"
                               , HA.class "ew-animate-fade-slide"
                               ]
                        )
                        value

                Nothing ->
                    H.text ""
    in
    H.span []
        [ H.span
            [ HA.class "ew-relative" ]
            (badge :: props.children)
        ]


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
    [ HA.class "ew-px-2.5 ew-py-1 ew-rounded-full"
    , HA.class "ew-leading-none ew-font-semibold ew-font-text ew-text-sm"
    , HA.class "ew-border ew-border-solid ew-border-base-bg"
    , HA.style "color" attrs.color
    , HA.style "background" attrs.background
    ]
