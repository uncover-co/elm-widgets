module W.Field exposing
    ( view
    , alignRight, footer
    , hint, success, warning, danger
    , id, class, htmlAttrs
    , Attribute
    )

{-|

@docs view
@docs alignRight, footer
@docs hint, success, warning, danger
@docs id, class, htmlAttrs
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , class : String
    , footer : Maybe (H.Html msg)
    , alignRight : Bool
    , hint : Maybe String
    , success : Maybe String
    , warning : Maybe String
    , danger : Maybe String
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , class = ""
    , footer = Nothing
    , alignRight = False
    , hint = Nothing
    , success = Nothing
    , warning = Nothing
    , danger = Nothing
    , htmlAttributes = []
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
footer : H.Html msg -> Attribute msg
footer v =
    Attribute <| \attrs -> { attrs | footer = Just v }


{-| -}
alignRight : Bool -> Attribute msg
alignRight v =
    Attribute <| \attrs -> { attrs | alignRight = v }


{-| -}
hint : String -> Attribute msg
hint v =
    Attribute <| \attrs -> { attrs | hint = Just v }


{-| -}
success : String -> Attribute msg
success v =
    Attribute <| \attrs -> { attrs | success = Just v }


{-| -}
warning : String -> Attribute msg
warning v =
    Attribute <| \attrs -> { attrs | warning = Just v }


{-| -}
danger : String -> Attribute msg
danger v =
    Attribute <| \attrs -> { attrs | danger = Just v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }



-- View


{-| -}
view :
    List (Attribute msg)
    ->
        { label : H.Html msg
        , input : H.Html msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.section
        (attrs.htmlAttributes
            ++ [ WH.maybeAttr HA.id attrs.id
               , HA.class "ew-p-4 ew-bg-base-bg ew-font-text"
               , HA.class attrs.class
               ]
        )
        [ H.div
            [ HA.classList [ ( "ew-flex ew-items-start ew-justify-between", attrs.alignRight ) ]
            ]
            [ H.div
                [ HA.classList [ ( "ew-w-[40%] ew-pr-4 ew-pt-1", attrs.alignRight ) ]
                ]
                [ H.h1
                    [ HA.class "ew-m-0 ew-font-normal ew-text-sm ew-pb-2 ew-font-text"
                    , HA.classList [ ( "ew-pb-0", attrs.alignRight ) ]
                    ]
                    [ props.label ]
                , attrs.footer
                    |> Maybe.map (\f -> H.p [ HA.class "ew-m-0 ew-pt-1 ew-text-base-aux ew-text-xs ew-font-text ew-text-aux" ] [ f ])
                    |> Maybe.withDefault (H.text "")
                ]
            , H.div
                [ HA.classList [ ( "ew-w-[60%]", attrs.alignRight ) ]
                ]
                [ props.input
                , case ( attrs.danger, attrs.warning, attrs.success ) of
                    ( Just danger_, _, _ ) ->
                        H.p
                            [ messageBaseClass
                            , HA.class "ew-bg-danger-fg/10 ew-text-danger-fg"
                            ]
                            [ H.text danger_ ]

                    ( Nothing, Just warning_, _ ) ->
                        H.p
                            [ messageBaseClass
                            , HA.class "ew-bg-warning-fg/10 ew-text-warning-fg"
                            ]
                            [ H.text warning_ ]

                    ( Nothing, Nothing, Just success_ ) ->
                        H.p
                            [ messageBaseClass
                            , HA.class "ew-bg-success-fg/10 ew-text-success-fg"
                            ]
                            [ H.text success_ ]

                    ( Nothing, Nothing, Nothing ) ->
                        case attrs.hint of
                            Just hint_ ->
                                H.p
                                    [ messageBaseClass
                                    , HA.class "ew-bg-base-aux/10 ew-text-base-fg"
                                    ]
                                    [ H.text hint_ ]

                            Nothing ->
                                H.text ""
                ]
            ]
        ]


messageBaseClass : H.Attribute msg
messageBaseClass =
    HA.class "ew-mt-2 ew-p-3 rounded-lg"
