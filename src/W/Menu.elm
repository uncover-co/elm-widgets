module W.Menu exposing
    ( view, viewButton, viewLink, viewTitle
    , id, disabled, selected, left, right, htmlAttrs, Attribute
    )

{-|

@docs view, viewButton, viewLink, viewTitle
@docs id, disabled, selected, left, right, htmlAttrs, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH


{-| -}
view : List (H.Html msg) -> H.Html msg
view children =
    H.ul [ HA.class "ew ew-menu" ]
        (children
            |> List.map
                (\i ->
                    H.li
                        [ HA.class "ew ew-menu-item-wrapper" ]
                        [ i ]
                )
        )


{-| -}
viewTitle :
    List (Attribute msg)
    ->
        { label : H.Html msg
        }
    -> H.Html msg
viewTitle attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.p [ HA.class "ew ew-menu-item-title" ]
        (baseContent attrs props.label)


{-| -}
viewButton :
    List (Attribute msg)
    ->
        { label : H.Html msg
        , onClick : msg
        }
    -> H.Html msg
viewButton attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.button
        (baseAttrs attrs
            ++ [ HE.onClick props.onClick
               ]
        )
        (baseContent attrs props.label)


{-| -}
viewLink :
    List (Attribute msg)
    ->
        { label : H.Html msg
        , href : String
        }
    -> H.Html msg
viewLink attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.a
        (baseAttrs attrs
            ++ [ HA.href props.href
               ]
        )
        (baseContent attrs props.label)


baseContent : Attributes msg -> H.Html msg -> List (H.Html msg)
baseContent attrs label =
    [ WH.maybeHtml (\a -> H.span [ HA.class "ew ew-menu-item-left" ] [ a ]) attrs.left
    , H.span [ HA.class "ew ew-menu-item-label" ] [ label ]
    , WH.maybeHtml (\a -> H.span [ HA.class "ew ew-menu-item-right" ] [ a ]) attrs.right
    ]



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , disabled : Bool
    , selected : Bool
    , left : Maybe (H.Html msg)
    , right : Maybe (H.Html msg)
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , disabled = False
    , selected = False
    , left = Nothing
    , right = Nothing
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


baseAttrs : Attributes msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ WH.maybeAttr HA.id attrs.id
           , HA.disabled attrs.disabled
           , HA.class "ew ew-menu-item-base"
           , HA.classList
                [ ( "ew-m-selected", attrs.selected )
                , ( "ew-m-disabled", attrs.disabled )
                ]
           ]



-- Attributes


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
selected : Bool -> Attribute msg
selected v =
    Attribute <| \attrs -> { attrs | selected = v }


{-| -}
left : H.Html msg -> Attribute msg
left v =
    Attribute <| \attrs -> { attrs | left = Just v }


{-| -}
right : H.Html msg -> Attribute msg
right v =
    Attribute <| \attrs -> { attrs | right = Just v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }
