module W.DataRow exposing
    ( view, header, footer, left, right
    , href, onClick
    , noBackground, padding, paddingX, paddingY, noPadding
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, header, footer, left, right


# Actions

@docs href, onClick


# Styles

@docs noBackground, padding, paddingX, paddingY, noPadding


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
    , padding : Maybe { x : Int, y : Int }
    , href : Maybe String
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
    , padding = Just { x = 8, y = 8 }
    , href = Nothing
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
href : String -> Attribute msg
href v =
    Attribute <| \attrs -> { attrs | href = Just v }


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
            ]

        mainClickableClass : H.Attribute msg
        mainClickableClass =
            HA.class "ew-focusable hover:ew-bg-base-aux/[0.07] active:ew-bg-base-aux/10"

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
                               ]
                        )

                _ ->
                    H.div mainAttrs
    in
    H.div
        (HA.class "ew-flex ew-items-center ew-gap-2 ew-box-border"
            :: WH.maybeAttr (HA.style "padding" << paddingString) attrs.padding
            :: HA.classList [ ( "ew-bg-base-bg", not attrs.noBackground ) ]
            :: attrs.htmlAttributes
        )
        [ main_
            [ WH.maybeHtml (side "ew-pr-2") attrs.left
            , H.div [ HA.class "ew-grow" ]
                [ WH.maybeHtml (\header_ -> H.div [ HA.class "ew-text-sm ew-text-base-aux ew-pb-1" ] header_) attrs.header
                , H.div [ HA.class "ew ew-data-row-label" ] children
                , WH.maybeHtml (\footer_ -> H.div [ HA.class "ew-text-sm ew-text-base-aux ew-pt-0.5" ] footer_) attrs.footer
                ]
            ]
        , attrs.right
            |> Maybe.map (side "")
            |> Maybe.withDefault (H.text "")
        ]


side : String -> List (H.Html msg) -> H.Html msg
side extraClass =
    H.div
        [ HA.class extraClass
        , HA.class "ew-shrink-0 ew-flex ew-items-center ew-gap-2"
        ]


paddingString : { x : Int, y : Int } -> String
paddingString { x, y } =
    String.fromInt y ++ "px " ++ String.fromInt x ++ "px"
