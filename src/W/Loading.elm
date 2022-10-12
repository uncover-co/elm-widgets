module W.Loading exposing
    ( circles, dots, ripples
    , color, size
    , id, htmlAttrs
    )

{-|

@docs circles, dots, ripples


# Style

@docs color, size


# Html

@docs id, htmlAttrs

-}

import Html as H
import Html.Attributes as HA
import Svg as S
import Svg.Attributes as SA
import Theme
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , size : Float
    , color : String
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , size = 25
    , color = Theme.baseAux
    , htmlAttributes = []
    }


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
size : Float -> Attribute msg
size v =
    Attribute <| \attrs -> { attrs | size = v }


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }



-- Main


{-| -}
circles : List (Attribute msg) -> S.Svg msg
circles attrs_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    S.svg
        (attrs.htmlAttributes
            ++ [ WH.maybeSvgAttr SA.id attrs.id
               , SA.style ("--color: " ++ attrs.color)
               , SA.class "ew-loading-circle"
               , SA.viewBox "0 0 40 40"
               , SA.height (String.fromFloat attrs.size ++ "px")
               , SA.width (String.fromFloat attrs.size ++ "px")
               , SA.xmlSpace "preserve"
               ]
        )
        [ S.path
            [ SA.fill "var(--color)"
            , SA.opacity "0.2"
            , SA.d "M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
            ]
            []
        , S.path
            [ SA.fill "var(--color)"
            , SA.d "M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"
            ]
            [ S.animateTransform
                [ SA.attributeType "xml"
                , SA.attributeName "transform"
                , SA.type_ "rotate"
                , SA.from "0 20 20"
                , SA.to "360 20 20"
                , SA.dur "1.2s"
                , SA.repeatCount "indefinite"
                ]
                []
            ]
        ]


{-| -}
dots : List (Attribute msg) -> H.Html msg
dots attrs_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.div
        (attrs.htmlAttributes
            ++ [ WH.maybeAttr HA.id attrs.id
               , HA.class "ew-loading-dots"
               , WH.styles
                    [ ( "--color", attrs.color )
                    , ( "--size", String.fromFloat attrs.size ++ "px" )
                    ]
               ]
        )
        [ H.div [] []
        , H.div [] []
        , H.div [] []
        , H.div [] []
        ]


{-| -}
ripples : List (Attribute msg) -> H.Html msg
ripples attrs_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.div
        (attrs.htmlAttributes
            ++ [ WH.maybeAttr HA.id attrs.id
               , HA.class "ew-loading-ripples"
               , WH.styles
                    [ ( "--size", String.fromFloat attrs.size ++ "px" )
                    , ( "--color", attrs.color )
                    ]
               ]
        )
        [ H.div [] []
        , H.div [] []
        ]
