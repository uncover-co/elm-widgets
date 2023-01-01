module W.Internal.Input exposing
    ( baseClass
    , view
    , viewWithIcon
    )

import Html as H
import Html.Attributes as HA


view :
    { prefix : Maybe (List (H.Html msg))
    , suffix : Maybe (List (H.Html msg))
    , readOnly : Bool
    , disabled : Bool
    , mask : Maybe (String -> String)
    , maskInput : String
    }
    -> H.Html msg
    -> H.Html msg
view attrs input =
    H.label
        [ HA.class "ew-input ew-bg-base-bg"
        , HA.class "ew-flex ew-items-stretch"
        , HA.class "ew-box-border ew-border ew-border-solid ew-border-base-aux/30 ew-rounded"
        , HA.class "ew-font-text ew-text-base ew-text-base-fg"
        , HA.class "ew-transition"
        , HA.class "ew-ring-offset-0 ew-ring-primary-fg/50"
        , HA.classList
            [ ( "focus-within:focus-visible:ew-ring focus-within:focus-visible:ew-border-primary-fg", not attrs.readOnly )
            ]
        ]
        [ case attrs.prefix of
            Just prefix ->
                H.div
                    [ prefixSuffixClass
                    , HA.class "ew-border-r"
                    ]
                    prefix

            Nothing ->
                H.text ""
        , H.div
            [ HA.class "ew-grow ew-relative"
            , HA.class "ew-flex ew-items-stretch ew-group"
            , HA.class "ew-min-h-[48px]"
            , HA.class "ew-rounded"
            , HA.classList
                [ ( "ew-text-transparent focus-within:ew-text-base-fg", attrs.mask /= Nothing )
                , ( "ew-text-base-fg", attrs.mask == Nothing )
                ]
            , if attrs.readOnly then
                HA.class "ew-bg-base-aux/[0.07] focus-within:ew-bg-base-aux/10"

              else if attrs.disabled then
                HA.class "ew-bg-base-aux/30"

              else
                HA.class "ew-bg-base-aux/[0.07] focus-within:ew-bg-base-bg"
            ]
            [ input
            , attrs.mask
                |> Maybe.map
                    (\f ->
                        H.div
                            [ HA.class "ew-absolute ew-z-10 ew-inset-x-3 ew-inset-y-0"
                            , HA.class "ew-flex ew-items-center"
                            , HA.class "ew-pointer-events-none"
                            ]
                            [ H.div
                                [ HA.class "ew-text-base-fg"
                                , HA.class "group-focus-within:ew-relative ew-top-[28px]"
                                , HA.class "group-focus-within:ew-text-sm"
                                , HA.class "group-focus-within:ew-px-2 group-focus-within:ew-leading-relaxed group-focus-within:ew-rounded"
                                , HA.class "group-focus-within:ew-bg-neutral-bg group-focus-within:ew-text-neutral-aux"
                                , HA.attribute "aria-label" "formatted input"
                                ]
                                [ H.text (f attrs.maskInput) ]
                            ]
                    )
                |> Maybe.withDefault (H.text "")
            ]
        , case attrs.suffix of
            Just suffix ->
                H.div
                    [ prefixSuffixClass
                    , HA.class "ew-border-l"
                    ]
                    suffix

            Nothing ->
                H.text ""
        ]


viewWithIcon :
    { prefix : Maybe (List (H.Html msg))
    , suffix : Maybe (List (H.Html msg))
    , disabled : Bool
    , readOnly : Bool
    , mask : Maybe (String -> String)
    , maskInput : String
    }
    -> H.Html msg
    -> H.Html msg
    -> H.Html msg
viewWithIcon attrs icon input =
    view attrs
        (H.div [ HA.class "ew-flex ew-items-stretch ew-w-full ew-relative" ]
            [ input
            , iconWrapper "ew-text-base-aux" icon
            ]
        )


prefixSuffixClass : H.Attribute msg
prefixSuffixClass =
    HA.class <|
        "ew-flex ew-items-center ew-justify-center ew-box-border"
            ++ " ew-border-0 ew-border-solid ew-border-base-aux/30"
            ++ " ew-p-2 ew-min-w-[48px] ew-self-stretch"
            ++ " ew-text-sm ew-text-base ew-text-base-aux"


baseClass : String
baseClass =
    "ew-appearance-none"
        ++ " ew-w-full"
        ++ " ew-py-2 ew-px-3 ew-box-border"
        ++ " ew-border-0 ew-outline-0"
        ++ " ew-font-text ew-text-base ew-text-inherit ew-leading-none"
        ++ " ew-placeholder-base-aux/80"
        ++ " ew-bg-transparent"
        ++ " focus:ew-outline-none focus:ew-shadow-none"


iconWrapper : String -> H.Html msg -> H.Html msg
iconWrapper class child =
    H.div
        [ HA.class "ew-input-icon ew-absolute ew-w-10 ew-inset-y-1 ew-right-1"
        , HA.class "ew-pointer-events-none ew-flex ew-items-center ew-justify-center"
        , HA.class "ew-bg-base-bg"
        , HA.class "before:ew-block before:ew-content-['']"
        , HA.class "before:ew-inset-0 before:ew-absolute"
        , HA.class class
        ]
        [ H.div [ HA.class "ew-relative" ] [ child ] ]
