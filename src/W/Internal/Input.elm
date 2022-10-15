module W.Internal.Input exposing
    ( areaClass
    , baseClass
    , iconChevronDown
    , iconWrapper
    )

import Html as H
import Html.Attributes as HA


baseClass : String
baseClass =
    areaClass
        ++ " ew-flex ew-items-center"
        ++ " ew-leading-none"


areaClass : String
areaClass =
    "ew-input ew-appearance-none ew-box-border"
        ++ " ew-relative"
        ++ " ew-w-full ew-min-h-[48px] ew-py-2 ew-px-3"
        ++ " ew-bg-base-aux/[0.07] ew-border ew-border-solid ew-border-base-aux/30 ew-rounded ew-shadow-none"
        ++ " ew-font-text ew-text-base"
        ++ " ew-transition"
        ++ " ew-outline-0 ew-ring-offset-0 ew-ring-primary-fg/50"
        ++ " disabled:ew-bg-base-aux/[0.25] disabled:ew-border-base-aux/[0.25]"
        ++ " focus:ew-bg-base-bg focus:ew-ring focus:ew-border-primary-fg"
        ++ " read-only:focus:ew-bg-base-aux/10"


iconWrapper : String -> H.Html msg -> H.Html msg
iconWrapper class child =
    H.div
        [ HA.class "ew-absolute ew-inset-y-1 ew-right-1 ew-w-8 ew-flex ew-items-center ew-justify-center"
        , HA.class class
        ]
        [ child ]


iconChevronDown : H.Html msg
iconChevronDown =
    H.div
        [ HA.class "ew-block ew-h-1.5 ew-w-1.5 ew-border-2 ew-border-current ew-border-solid ew-rotate-[45deg]"
        , HA.style "border-left" "none"
        , HA.style "border-top" "none"
        ]
        []
