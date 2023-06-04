module W.Menu exposing
    ( view, viewCustom, viewButton, viewLink, viewDummy, viewTitle
    , disabled, selected, left, right, noPadding
    , padding, paddingX, paddingY, titlePadding, titlePaddingX, titlePaddingY
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewCustom, viewButton, viewLink, viewDummy, viewTitle


# Styles

@docs disabled, selected, left, right, noPadding


# Container Styles

@docs padding, paddingX, paddingY, titlePadding, titlePaddingX, titlePaddingY


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Theme
import W.Internal.Helpers as WH



-- Menu Attributes


type MenuAttribute msg
    = MenuAttribute (MenuAttributes -> MenuAttributes)


type alias MenuAttributes =
    { titlePadding : { x : Int, y : Int }
    , padding : { x : Int, y : Int }
    }


defaultMenuAttrs : MenuAttributes
defaultMenuAttrs =
    { titlePadding = { x = 12, y = 8 }
    , padding = { x = 12, y = 8 }
    }


applyMenuAttrs : List (MenuAttribute msg) -> MenuAttributes
applyMenuAttrs attrs =
    List.foldl (\(MenuAttribute fn) a -> fn a) defaultMenuAttrs attrs



-- Menu Attribute functions


{-| -}
padding : Int -> MenuAttribute msg
padding v =
    MenuAttribute <| \attrs -> { attrs | padding = { x = v, y = v } }


{-| -}
paddingX : Int -> MenuAttribute msg
paddingX v =
    MenuAttribute <|
        \attrs -> { attrs | padding = { x = v, y = attrs.padding.y } }


{-| -}
paddingY : Int -> MenuAttribute msg
paddingY v =
    MenuAttribute <|
        \attrs -> { attrs | padding = { y = v, x = attrs.padding.x } }


{-| -}
titlePadding : Int -> MenuAttribute msg
titlePadding v =
    MenuAttribute <|
        \attrs -> { attrs | titlePadding = { x = v, y = v } }


{-| -}
titlePaddingX : Int -> MenuAttribute msg
titlePaddingX v =
    MenuAttribute <|
        \attrs -> { attrs | titlePadding = { x = v, y = attrs.titlePadding.y } }


{-| -}
titlePaddingY : Int -> MenuAttribute msg
titlePaddingY v =
    MenuAttribute <|
        \attrs -> { attrs | titlePadding = { y = v, x = attrs.titlePadding.x } }



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , selected : Bool
    , padding : Bool
    , left : Maybe (List (H.Html msg))
    , right : Maybe (List (H.Html msg))
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes msg
defaultAttrs =
    { disabled = False
    , selected = False
    , padding = True
    , left = Nothing
    , right = Nothing
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs



-- Attribute functions


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
selected : Bool -> Attribute msg
selected v =
    Attribute <| \attrs -> { attrs | selected = v }


{-| -}
left : List (H.Html msg) -> Attribute msg
left v =
    Attribute <| \attrs -> { attrs | left = Just v }


{-| -}
right : List (H.Html msg) -> Attribute msg
right v =
    Attribute <| \attrs -> { attrs | right = Just v }


{-| -}
noPadding : Attribute msg
noPadding =
    Attribute <| \attrs -> { attrs | padding = False }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- View


{-| -}
view : List (H.Html msg) -> H.Html msg
view =
    viewCustom []


{-| -}
viewCustom : List (MenuAttribute msg) -> List (H.Html msg) -> H.Html msg
viewCustom attrs_ children =
    let
        attrs : MenuAttributes
        attrs =
            applyMenuAttrs attrs_
    in
    H.ul
        [ HA.class "ew-m-0 ew-p-0 ew-w-full ew-list-none ew-bg-base-bg ew-font-text"
        , Theme.styles
            [ ( "--ew-menu-padding", paddingString attrs.padding )
            , ( "--ew-menu-title-padding", paddingString attrs.titlePadding )
            ]
        ]
        (children
            |> List.map (\i -> H.li [ HA.class "ew-m-0 ew-flex ew-justify-stretch" ] [ i ])
        )


paddingString : { x : Int, y : Int } -> String
paddingString { x, y } =
    String.fromInt y ++ "px " ++ String.fromInt x ++ "px"


{-| -}
viewTitle :
    List (Attribute msg)
    ->
        { label : List (H.Html msg)
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
        , if attrs.padding then
            Theme.styles [ ( "padding", "var(--ew-menu-title-padding)" ) ]

          else
            HA.class ""
        ]
        (baseContent attrs props.label)


{-| -}
viewDummy :
    List (Attribute msg)
    -> List (H.Html msg)
    -> H.Html msg
viewDummy attrs_ label =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.div
        (baseAttrs attrs
            ++ [ HA.class "ew-border-0 ew-focusable"
               , HA.tabindex 0
               ]
        )
        (baseContent attrs label)


{-| -}
viewButton :
    List (Attribute msg)
    ->
        { label : List (H.Html msg)
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
        { label : List (H.Html msg)
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


baseAttrs : Attributes msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ HA.disabled attrs.disabled
           , HA.class "ew-m-0 ew-w-full ew-box-border ew-flex ew-items-center ew-content-start"
           , HA.class "ew-text-left ew-text-base ew-text-fg"
           , HA.class "hover:ew-bg-base-aux/[0.07]"
           , HA.class "active:ew-bg-base-aux/10"
           , HA.class "ew-focusable ew-relative focus:ew-z-10"
           , HA.classList
                [ ( "ew-text-primary-fg ew-bg-primary-fg/10 hover:ew-bg-primary-fg/[0.15] active:ew-bg-primary-fg/20", attrs.selected )
                , ( "ew-text-base-fg ew-bg-base-bg", not attrs.selected )
                , ( "ew-m-disabled", attrs.disabled )
                ]
           , if attrs.padding then
                Theme.styles [ ( "padding", "var(--ew-menu-padding)" ) ]

             else
                HA.class ""
           ]


baseContent : Attributes msg -> List (H.Html msg) -> List (H.Html msg)
baseContent attrs label =
    [ WH.maybeHtml (H.span [ HA.class "ew-shrink-0 ew-pr-3" ]) attrs.left
    , H.span [ HA.class "ew-grow" ] label
    , WH.maybeHtml (H.span [ HA.class "ew-shrink-0 ew-pr-3" ]) attrs.right
    ]
