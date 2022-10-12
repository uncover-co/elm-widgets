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


{-| -}
view : List (H.Html msg) -> H.Html msg
view children =
    H.ul [ HA.class "ew-m-0 ew-p-0 ew-list-none ew-bg-base-bg ew-font-text" ]
        (children
            |> List.map (\i -> H.li [ HA.class "ew-m-0" ] [ i ])
        )


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


baseAttrs : Attributes msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ WH.maybeAttr HA.id attrs.id
           , HA.disabled attrs.disabled
           , HA.class "ew-m-0 ew-w-full ew-box-border ew-flex ew-items-center ew-content-start"
           , HA.class "ew-px-3 ew-py-2"
           , HA.class "ew-text-left ew-text-base ew-text-fg"
           , HA.class "hover:ew-bg-base-aux/[0.07]"
           , HA.class "active:ew-bg-base-aux/10"
           , HA.classList
                [ ( "ew-text-primary-fg ew-bg-primary-fg/10 hover:ew-bg-primary-fg/[0.15] active:ew-bg-primary-fg/20", attrs.selected )
                , ( "ew-text-base-fg ew-bg-base-bg", not attrs.selected )
                , ( "ew-m-disabled", attrs.disabled )
                ]
           ]


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
    H.p
        [ HA.class "ew-m-0 ew-flex ew-items-center"
        , HA.class "ew-uppercase ew-text-xs ew-font-bold ew-font-text ew-text-base-aux"
        , HA.class "ew-pt-6 ew-px-4 ew-pb-2"
        ]
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
               , HA.class "ew-border-0"
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
               , HA.class "ew-no-underline"
               ]
        )
        (baseContent attrs props.label)


baseContent : Attributes msg -> H.Html msg -> List (H.Html msg)
baseContent attrs label =
    [ WH.maybeHtml (\a -> H.span [ HA.class "ew-shrink-0 ew-pr-3" ] [ a ]) attrs.left
    , H.span [ HA.class "ew-grow" ] [ label ]
    , WH.maybeHtml (\a -> H.span [ HA.class "ew-shrink-0 ew-pr-3" ] [ a ]) attrs.right
    ]
