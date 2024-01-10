module W.DataRow exposing
    ( view, header, footer, left, right
    , viewNext, viewNextExtra
    , href, openNewTab, onClick, noLeftClick
    , noBackground, gap, innerGap, padding, paddingX, paddingY, noPadding
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, header, footer, left, right


# Next API

This will be the only API available on the next major release.

@docs viewNext, viewNextExtra


# Actions

@docs href, openNewTab, onClick, noLeftClick


# Styles

@docs noBackground, gap, innerGap, padding, paddingX, paddingY, noPadding


# Html

@docs htmlAttrs, noAttr, Attribute

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
    { footer : Maybe (List (H.Html msg))
    , header : Maybe (List (H.Html msg))
    , left : Maybe (List (H.Html msg))
    , right : Maybe (List (H.Html msg))
    , onClick : Maybe msg
    , noLeftClick : Bool
    , padding : Maybe { x : Int, y : Int }
    , gap : Int
    , innerGap : Int
    , href : Maybe String
    , openNewTab : Bool
    , noBackground : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { footer = Nothing
    , header = Nothing
    , left = Nothing
    , right = Nothing
    , onClick = Nothing
    , noLeftClick = False
    , padding = Just { x = 8, y = 8 }
    , gap = 8
    , innerGap = 8
    , href = Nothing
    , openNewTab = False
    , noBackground = False
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
footer : List (H.Html msg) -> Attribute msg
footer v =
    Attribute <| \attrs -> { attrs | footer = Just v }


{-| -}
header : List (H.Html msg) -> Attribute msg
header v =
    Attribute <| \attrs -> { attrs | header = Just v }


{-| -}
left : List (H.Html msg) -> Attribute msg
left v =
    Attribute <| \attrs -> { attrs | left = Just v }


{-| -}
right : List (H.Html msg) -> Attribute msg
right v =
    Attribute <| \attrs -> { attrs | right = Just v }


{-| -}
onClick : msg -> Attribute msg
onClick v =
    Attribute <| \attrs -> { attrs | onClick = Just v }


{-| -}
noLeftClick : Attribute msg
noLeftClick =
    Attribute <| \attrs -> { attrs | noLeftClick = True }


{-| -}
noPadding : Attribute msg
noPadding =
    Attribute <| \attrs -> { attrs | padding = Nothing }


{-| -}
padding : Int -> Attribute msg
padding v =
    Attribute <| \attrs -> { attrs | padding = Just { x = v, y = v } }


{-| -}
paddingX : Int -> Attribute msg
paddingX v =
    Attribute <| \attrs -> { attrs | padding = Maybe.map (\p -> { p | x = v }) attrs.padding }


{-| -}
paddingY : Int -> Attribute msg
paddingY v =
    Attribute <| \attrs -> { attrs | padding = Maybe.map (\p -> { p | y = v }) attrs.padding }


{-| -}
gap : Int -> Attribute msg
gap v =
    Attribute <| \attrs -> { attrs | gap = v }


{-| -}
innerGap : Int -> Attribute msg
innerGap v =
    Attribute <| \attrs -> { attrs | innerGap = v }


{-| -}
href : String -> Attribute msg
href v =
    Attribute <| \attrs -> { attrs | href = Just v }


{-| -}
openNewTab : Attribute msg
openNewTab =
    Attribute <| \attrs -> { attrs | openNewTab = True }


{-| -}
noBackground : Attribute msg
noBackground =
    Attribute <| \attrs -> { attrs | noBackground = True }


{-| Attributes applied to the parent element.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity


{-| -}
view :
    List (Attribute msg)
    -> List (H.Html msg)
    -> H.Html msg
view attrs_ children =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        mainAttrs : List (H.Attribute msg)
        mainAttrs =
            [ HA.class "ew-grow ew-flex ew-items-center"
            , HA.class "ew-w-full ew-bg-transparent"
            , HA.class "ew-btn-like ew-text-base ew-text-left ew-font-text ew-text-base-fg"
            , HA.class "ew-p-2"
            , HA.style "gap" (WH.formatPx attrs.gap)
            ]

        mainClickableClass : H.Attribute msg
        mainClickableClass =
            HA.class "ew-focusable hover:ew-bg-base-aux/[0.07] active:ew-bg-base-aux/10"

        left_ : H.Html msg
        left_ =
            if attrs.noLeftClick then
                WH.maybeHtml (side attrs.innerGap) attrs.left

            else
                H.text ""

        mainLeft : H.Html msg
        mainLeft =
            if attrs.noLeftClick then
                H.text ""

            else
                WH.maybeHtml (side attrs.innerGap) attrs.left

        main_ : List (H.Html msg) -> H.Html msg
        main_ =
            case ( attrs.onClick, attrs.href ) of
                ( Just onClick_, _ ) ->
                    H.button
                        (mainAttrs
                            ++ [ mainClickableClass
                               , HE.onClick onClick_
                               ]
                        )

                ( Nothing, Just href_ ) ->
                    H.a
                        (mainAttrs
                            ++ [ mainClickableClass
                               , HA.href href_
                               , if attrs.openNewTab then
                                    HA.target "_blank"

                                 else
                                    HA.class ""
                               ]
                        )

                _ ->
                    H.div mainAttrs
    in
    H.div
        (HA.class "ew-flex ew-items-center ew-gap-2 ew-box-border"
            :: HA.style "gap" (WH.formatPx attrs.gap)
            :: WH.maybeAttr (HA.style "padding" << WH.paddingXY) attrs.padding
            :: HA.classList [ ( "ew-bg-base-bg", not attrs.noBackground ) ]
            :: attrs.htmlAttributes
        )
        [ left_
        , main_
            [ mainLeft
            , H.div [ HA.class "ew-grow" ]
                [ WH.maybeHtml (\header_ -> H.div [ HA.class "ew-text-sm ew-text-base-aux ew-pb-1" ] header_) attrs.header
                , H.div [ HA.class "ew ew-data-row-label" ] children
                , WH.maybeHtml (\footer_ -> H.div [ HA.class "ew-text-sm ew-text-base-aux ew-pt-0.5" ] footer_) attrs.footer
                ]
            ]
        , WH.maybeHtml (side attrs.innerGap) attrs.right
        ]



-- Next API
-- TODO: Make the only one on the next release.


{-| -}
viewNext :
    List (Attribute msg)
    ->
        { left : List (H.Html msg)
        , main : List (H.Html msg)
        , right : List (H.Html msg)
        }
    -> H.Html msg
viewNext attrs_ props =
    view
        (attrs_
            ++ [ ifNotEmpty left props.left
               , ifNotEmpty right props.right
               ]
        )
        props.main


{-| -}
viewNextExtra :
    List (Attribute msg)
    ->
        { left : List (H.Html msg)
        , header : List (H.Html msg)
        , main : List (H.Html msg)
        , footer : List (H.Html msg)
        , right : List (H.Html msg)
        }
    -> H.Html msg
viewNextExtra attrs_ props =
    view
        (attrs_
            ++ [ ifNotEmpty left props.left
               , ifNotEmpty right props.right
               , header props.header
               , footer props.footer
               ]
        )
        props.main



-- Helpers


side : Int -> List (H.Html msg) -> H.Html msg
side innerGap_ =
    H.div
        [ HA.class "ew-shrink-0 ew-flex ew-items-center ew-gap-2"
        , HA.style "gap" (WH.formatPx innerGap_)
        ]


ifNotEmpty : (List (H.Html msg) -> Attribute msg) -> List (H.Html msg) -> Attribute msg
ifNotEmpty attr xs =
    case xs of
        [] ->
            noAttr

        _ ->
            attr xs
