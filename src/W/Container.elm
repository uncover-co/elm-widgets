module W.Container exposing
    ( view
    , vertical, horizontal, inline, fill
    , background
    , card, rounded, extraRounded
    , shadow, largeShadow
    , largeScreen
    , alignTop, alignBottom, alignLeft, alignRight, alignCenterX, alignCenterY
    , spaceBetween, spaceAround, fillSpace
    , pad_0, pad_1, pad_2, pad_3, pad_4, pad_6, pad_8, pad_12, pad_16
    , padX_0, padX_1, padX_2, padX_3, padX_4, padX_6, padX_8, padX_12, padX_16
    , padY_0, padY_1, padY_2, padY_3, padY_4, padY_6, padY_8, padY_12, padY_16
    , padLeft_0, padLeft_1, padLeft_2, padLeft_3, padLeft_4, padLeft_6, padLeft_8, padLeft_12, padLeft_16
    , padRight_0, padRight_1, padRight_2, padRight_3, padRight_4, padRight_6, padRight_8, padRight_12, padRight_16
    , padTop_0, padTop_1, padTop_2, padTop_3, padTop_4, padTop_6, padTop_8, padTop_12, padTop_16
    , padBottom_0, padBottom_1, padBottom_2, padBottom_3, padBottom_4, padBottom_6, padBottom_8, padBottom_12, padBottom_16
    , gap_0, gap_1, gap_2, gap_3, gap_4, gap_6, gap_8, gap_12, gap_16
    , node, styleAttrs, htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Styles

@docs vertical, horizontal, inline, fill
@docs background
@docs card, rounded, extraRounded
@docs shadow, largeShadow


# Layouts

@docs largeScreen
@docs alignTop, alignBottom, alignLeft, alignRight, alignCenterX, alignCenterY
@docs spaceBetween, spaceAround, fillSpace


# Padding

@docs pad_0, pad_1, pad_2, pad_3, pad_4, pad_6, pad_8, pad_12, pad_16
@docs padX_0, padX_1, padX_2, padX_3, padX_4, padX_6, padX_8, padX_12, padX_16
@docs padY_0, padY_1, padY_2, padY_3, padY_4, padY_6, padY_8, padY_12, padY_16
@docs padLeft_0, padLeft_1, padLeft_2, padLeft_3, padLeft_4, padLeft_6, padLeft_8, padLeft_12, padLeft_16
@docs padRight_0, padRight_1, padRight_2, padRight_3, padRight_4, padRight_6, padRight_8, padRight_12, padRight_16
@docs padTop_0, padTop_1, padTop_2, padTop_3, padTop_4, padTop_6, padTop_8, padTop_12, padTop_16
@docs padBottom_0, padBottom_1, padBottom_2, padBottom_3, padBottom_4, padBottom_6, padBottom_8, padBottom_12, padBottom_16


# Gaps

@docs gap_0, gap_1, gap_2, gap_3, gap_4, gap_6, gap_8, gap_12, gap_16


# Html

@docs node, styleAttrs, htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Theme



-- Main


{-| -}
view : List (Attribute msg) -> List (H.Html msg) -> H.Html msg
view attrs_ children =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        layoutClass_ : String
        layoutClass_ =
            layoutClass attrs

        displayClass : String
        displayClass =
            if attrs.inline then
                "ew-inline-flex"

            else
                "ew-flex"

        styleAttrs_ : H.Attribute msg
        styleAttrs_ =
            case attrs.background of
                Just background_ ->
                    Theme.styles (( "background", background_ ) :: attrs.styles)

                Nothing ->
                    Theme.styles attrs.styles
    in
    H.node
        attrs.node
        (attrs.htmlAttributes
            ++ [ HA.class attrs.class
               , HA.class displayClass
               , HA.class layoutClass_
               , HA.class "ew-box-border"
               , styleAttrs_
               ]
        )
        children



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { node : String
    , class : String
    , styles : List ( String, String )
    , inline : Bool
    , background : Maybe String
    , orientation : Orientation
    , verticalAlignment : VerticalAlignment
    , horizontalAlignment : HorizontalAlignment
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes msg
defaultAttrs =
    { node = "div"
    , class = ""
    , styles = []
    , inline = False
    , background = Nothing
    , orientation = Vertical
    , horizontalAlignment = FillSpace
    , verticalAlignment = VerticalCenter
    , htmlAttributes = []
    }


type Orientation
    = Vertical
    | Horizontal


type VerticalAlignment
    = Top
    | VerticalCenter
    | Bottom


type HorizontalAlignment
    = Left
    | Right
    | HorizontalCenter
    | SpaceBetween
    | SpaceAround
    | FillSpace



-- Attributes : Helpers


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


applyAttrsTo : List (Attribute msg) -> Attributes msg -> Attributes msg
applyAttrsTo attrs default =
    List.foldl (\(Attribute fn) a -> fn a) default attrs


{-| -}
node : String -> Attribute msg
node v =
    Attribute (\attr -> { attr | node = v })


{-| -}
inline : Attribute msg
inline =
    Attribute (\attr -> { attr | inline = True })


{-| -}
background : String -> Attribute msg
background v =
    Attribute (\attr -> { attr | background = Just v })


{-| -}
rounded : Attribute msg
rounded =
    addClass "ew-rounded"


{-| -}
extraRounded : Attribute msg
extraRounded =
    addClass "ew-rounded-lg"


{-| -}
shadow : Attribute msg
shadow =
    addClass "ew-shadow"


{-| -}
largeShadow : Attribute msg
largeShadow =
    addClass "ew-shadow-lg"


{-| -}
fill : Attribute msg
fill =
    addClass "ew-grow"


{-| -}
card : Attribute msg
card =
    Attribute (\attr -> { attr | background = Just Theme.baseBackground, class = attr.class ++ " ew-shadow ew-rounded" })


{-| Note that for `style` attributes you should use the [styleAttrs](https://package.elm-lang.org/packages/uncover-co/elm-widgets/latest/W-Container#styleAttrs) attribute instead.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute (\attr -> { attr | htmlAttributes = v })


{-| Used to pass in extra styles to your container.

    W.Container.view
        [ W.Container.styles
            [ ( "height", "200px" )
            , ( "position", "relative" )
            ]
        ]
        []

-}
styleAttrs : List ( String, String ) -> Attribute msg
styleAttrs v =
    Attribute (\attr -> { attr | styles = v })


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Responsive


{-| -}
largeScreen : List (Attribute msg) -> Attribute msg
largeScreen largeAttr_ =
    Attribute
        (\attr ->
            let
                largeAttr : Attributes msg
                largeAttr =
                    applyAttrs largeAttr_

                padding : String
                padding =
                    if String.isEmpty largeAttr.class then
                        ""

                    else
                        largeAttr.class
                            |> String.trim
                            |> String.append "lg:"
                            |> String.replace " " " lg:"

                allAttr : Attributes msg
                allAttr =
                    applyAttrsTo largeAttr_ attr

                layout : String
                layout =
                    layoutClass allAttr
                        |> String.trim
                        |> String.append "lg:"
                        |> String.replace " " " lg:"
            in
            { attr | class = attr.class ++ " " ++ layout ++ " " ++ padding }
        )



-- Layout


layoutClass : Attributes msg -> String
layoutClass attrs =
    case attrs.orientation of
        Vertical ->
            let
                yAxis : String
                yAxis =
                    case attrs.verticalAlignment of
                        Top ->
                            "ew-justify-start"

                        VerticalCenter ->
                            "ew-justify-center"

                        Bottom ->
                            "ew-justify-end"

                xAxis : String
                xAxis =
                    case attrs.horizontalAlignment of
                        Left ->
                            "ew-items-start"

                        HorizontalCenter ->
                            "ew-items-center"

                        Right ->
                            "ew-items-end"

                        SpaceBetween ->
                            ""

                        SpaceAround ->
                            ""

                        FillSpace ->
                            ""
            in
            "ew-flex-col " ++ yAxis ++ " " ++ xAxis

        Horizontal ->
            let
                yAxis : String
                yAxis =
                    case attrs.verticalAlignment of
                        Top ->
                            "ew-items-start"

                        VerticalCenter ->
                            "ew-items-center"

                        Bottom ->
                            "ew-items-end"

                xAxis : String
                xAxis =
                    case attrs.horizontalAlignment of
                        Left ->
                            "ew-justify-start"

                        HorizontalCenter ->
                            "ew-justify-center"

                        Right ->
                            "ew-justify-end"

                        SpaceBetween ->
                            "ew-justify-between"

                        SpaceAround ->
                            "ew-justify-around"

                        FillSpace ->
                            "ew-justify-stretch"
            in
            "ew-flex-row " ++ yAxis ++ " " ++ xAxis


{-| -}
vertical : Attribute msg
vertical =
    Attribute (\attr -> { attr | orientation = Vertical })


{-| -}
horizontal : Attribute msg
horizontal =
    Attribute (\attr -> { attr | orientation = Horizontal })


{-| -}
alignTop : Attribute msg
alignTop =
    Attribute (\attr -> { attr | verticalAlignment = Top })


{-| -}
alignBottom : Attribute msg
alignBottom =
    Attribute (\attr -> { attr | verticalAlignment = Bottom })


{-| -}
alignCenterY : Attribute msg
alignCenterY =
    Attribute (\attr -> { attr | verticalAlignment = VerticalCenter })


{-| -}
alignLeft : Attribute msg
alignLeft =
    Attribute (\attr -> { attr | horizontalAlignment = Left })


{-| -}
alignRight : Attribute msg
alignRight =
    Attribute (\attr -> { attr | horizontalAlignment = Right })


{-| -}
alignCenterX : Attribute msg
alignCenterX =
    Attribute (\attr -> { attr | horizontalAlignment = HorizontalCenter })


{-| -}
spaceBetween : Attribute msg
spaceBetween =
    Attribute (\attr -> { attr | horizontalAlignment = SpaceBetween })


{-| -}
spaceAround : Attribute msg
spaceAround =
    Attribute (\attr -> { attr | horizontalAlignment = SpaceAround })


{-| -}
fillSpace : Attribute msg
fillSpace =
    Attribute (\attr -> { attr | horizontalAlignment = FillSpace })



{- Gap & Padding - Tailwind Dynamic Class Setup

   lg:ew-flex-col        lg:ew-flex-row
   lg:ew-items-center    lg:ew-items-start    lg:ew-items-end
   lg:ew-justify-center  lg:ew-justify-start  lg:ew-justify-end
   lg:ew-justify-between lg:ew-justify-around

   lg:ew-gap-0 lg:ew-gap-1 lg:ew-gap-2 lg:ew-gap-4 lg:ew-gap-6 lg:ew-gap-8 lg:ew-gap-12 lg:ew-gap-16
   lg:ew-p-0   lg:ew-p-1   lg:ew-p-2   lg:ew-p-4   lg:ew-p-6   lg:ew-p-8   lg:ew-p-12   lg:ew-p-16
   lg:ew-px-0  lg:ew-px-1  lg:ew-px-2  lg:ew-px-4  lg:ew-px-6  lg:ew-px-8  lg:ew-px-12  lg:ew-px-16
   lg:ew-py-0  lg:ew-py-1  lg:ew-py-2  lg:ew-py-4  lg:ew-py-6  lg:ew-py-8  lg:ew-py-12  lg:ew-py-16
   lg:ew-pt-0  lg:ew-pt-1  lg:ew-pt-2  lg:ew-pt-4  lg:ew-pt-6  lg:ew-pt-8  lg:ew-pt-12  lg:ew-pt-16
   lg:ew-pl-0  lg:ew-pl-1  lg:ew-pl-2  lg:ew-pl-4  lg:ew-pl-6  lg:ew-pl-8  lg:ew-pl-12  lg:ew-pl-16
   lg:ew-pr-0  lg:ew-pr-1  lg:ew-pr-2  lg:ew-pr-4  lg:ew-pr-6  lg:ew-pr-8  lg:ew-pr-12  lg:ew-pr-16
   lg:ew-pl-0  lg:ew-pl-1  lg:ew-pl-2  lg:ew-pl-4  lg:ew-pl-6  lg:ew-pl-8  lg:ew-pl-12  lg:ew-pl-16

-}


addClass : String -> Attribute msg
addClass class =
    Attribute (\attr -> { attr | class = attr.class ++ " " ++ class })


{-| -}
gap_0 : Attribute msg
gap_0 =
    addClass "ew-gap-0"


{-| -}
gap_1 : Attribute msg
gap_1 =
    addClass "ew-gap-1"


{-| -}
gap_2 : Attribute msg
gap_2 =
    addClass "ew-gap-2"


{-| -}
gap_3 : Attribute msg
gap_3 =
    addClass "ew-gap-3"


{-| -}
gap_4 : Attribute msg
gap_4 =
    addClass "ew-gap-4"


{-| -}
gap_6 : Attribute msg
gap_6 =
    addClass "ew-gap-6"


{-| -}
gap_8 : Attribute msg
gap_8 =
    addClass "ew-gap-8"


{-| -}
gap_12 : Attribute msg
gap_12 =
    addClass "ew-gap-12"


{-| -}
gap_16 : Attribute msg
gap_16 =
    addClass "ew-gap-16"


{-| -}
pad_0 : Attribute msg
pad_0 =
    addClass "ew-p-0"


{-| -}
pad_1 : Attribute msg
pad_1 =
    addClass "ew-p-1"


{-| -}
pad_2 : Attribute msg
pad_2 =
    addClass "ew-p-2"


{-| -}
pad_3 : Attribute msg
pad_3 =
    addClass "ew-p-3"


{-| -}
pad_4 : Attribute msg
pad_4 =
    addClass "ew-p-4"


{-| -}
pad_6 : Attribute msg
pad_6 =
    addClass "ew-p-6"


{-| -}
pad_8 : Attribute msg
pad_8 =
    addClass "ew-p-8"


{-| -}
pad_12 : Attribute msg
pad_12 =
    addClass "ew-p-12"


{-| -}
pad_16 : Attribute msg
pad_16 =
    addClass "ew-p-16"


{-| -}
padX_0 : Attribute msg
padX_0 =
    addClass "ew-px-0"


{-| -}
padX_1 : Attribute msg
padX_1 =
    addClass "ew-px-1"


{-| -}
padX_2 : Attribute msg
padX_2 =
    addClass "ew-px-2"


{-| -}
padX_3 : Attribute msg
padX_3 =
    addClass "ew-px-3"


{-| -}
padX_4 : Attribute msg
padX_4 =
    addClass "ew-px-4"


{-| -}
padX_6 : Attribute msg
padX_6 =
    addClass "ew-px-6"


{-| -}
padX_8 : Attribute msg
padX_8 =
    addClass "ew-px-8"


{-| -}
padX_12 : Attribute msg
padX_12 =
    addClass "ew-px-12"


{-| -}
padX_16 : Attribute msg
padX_16 =
    addClass "ew-px-16"


{-| -}
padY_0 : Attribute msg
padY_0 =
    addClass "ew-py-0"


{-| -}
padY_1 : Attribute msg
padY_1 =
    addClass "ew-py-1"


{-| -}
padY_2 : Attribute msg
padY_2 =
    addClass "ew-py-2"


{-| -}
padY_3 : Attribute msg
padY_3 =
    addClass "ew-py-3"


{-| -}
padY_4 : Attribute msg
padY_4 =
    addClass "ew-py-4"


{-| -}
padY_6 : Attribute msg
padY_6 =
    addClass "ew-py-6"


{-| -}
padY_8 : Attribute msg
padY_8 =
    addClass "ew-py-8"


{-| -}
padY_12 : Attribute msg
padY_12 =
    addClass "ew-py-12"


{-| -}
padY_16 : Attribute msg
padY_16 =
    addClass "ew-py-16"


{-| -}
padTop_0 : Attribute msg
padTop_0 =
    addClass "ew-pt-0"


{-| -}
padTop_1 : Attribute msg
padTop_1 =
    addClass "ew-pt-1"


{-| -}
padTop_2 : Attribute msg
padTop_2 =
    addClass "ew-pt-2"


{-| -}
padTop_3 : Attribute msg
padTop_3 =
    addClass "ew-pt-3"


{-| -}
padTop_4 : Attribute msg
padTop_4 =
    addClass "ew-pt-4"


{-| -}
padTop_6 : Attribute msg
padTop_6 =
    addClass "ew-pt-6"


{-| -}
padTop_8 : Attribute msg
padTop_8 =
    addClass "ew-pt-8"


{-| -}
padTop_12 : Attribute msg
padTop_12 =
    addClass "ew-pt-12"


{-| -}
padTop_16 : Attribute msg
padTop_16 =
    addClass "ew-pt-16"


{-| -}
padLeft_0 : Attribute msg
padLeft_0 =
    addClass "ew-pl-0"


{-| -}
padLeft_1 : Attribute msg
padLeft_1 =
    addClass "ew-pl-1"


{-| -}
padLeft_2 : Attribute msg
padLeft_2 =
    addClass "ew-pl-2"


{-| -}
padLeft_3 : Attribute msg
padLeft_3 =
    addClass "ew-pl-3"


{-| -}
padLeft_4 : Attribute msg
padLeft_4 =
    addClass "ew-pl-4"


{-| -}
padLeft_6 : Attribute msg
padLeft_6 =
    addClass "ew-pl-6"


{-| -}
padLeft_8 : Attribute msg
padLeft_8 =
    addClass "ew-pl-8"


{-| -}
padLeft_12 : Attribute msg
padLeft_12 =
    addClass "ew-pl-12"


{-| -}
padLeft_16 : Attribute msg
padLeft_16 =
    addClass "ew-pl-16"


{-| -}
padRight_0 : Attribute msg
padRight_0 =
    addClass "ew-pr-0"


{-| -}
padRight_1 : Attribute msg
padRight_1 =
    addClass "ew-pr-1"


{-| -}
padRight_2 : Attribute msg
padRight_2 =
    addClass "ew-pr-2"


{-| -}
padRight_3 : Attribute msg
padRight_3 =
    addClass "ew-pr-3"


{-| -}
padRight_4 : Attribute msg
padRight_4 =
    addClass "ew-pr-4"


{-| -}
padRight_6 : Attribute msg
padRight_6 =
    addClass "ew-pr-6"


{-| -}
padRight_8 : Attribute msg
padRight_8 =
    addClass "ew-pr-8"


{-| -}
padRight_12 : Attribute msg
padRight_12 =
    addClass "ew-pr-12"


{-| -}
padRight_16 : Attribute msg
padRight_16 =
    addClass "ew-pr-16"


{-| -}
padBottom_0 : Attribute msg
padBottom_0 =
    addClass "ew-pb-0"


{-| -}
padBottom_1 : Attribute msg
padBottom_1 =
    addClass "ew-pb-1"


{-| -}
padBottom_2 : Attribute msg
padBottom_2 =
    addClass "ew-pb-2"


{-| -}
padBottom_3 : Attribute msg
padBottom_3 =
    addClass "ew-pb-3"


{-| -}
padBottom_4 : Attribute msg
padBottom_4 =
    addClass "ew-pb-4"


{-| -}
padBottom_6 : Attribute msg
padBottom_6 =
    addClass "ew-pb-6"


{-| -}
padBottom_8 : Attribute msg
padBottom_8 =
    addClass "ew-pb-8"


{-| -}
padBottom_12 : Attribute msg
padBottom_12 =
    addClass "ew-pb-12"


{-| -}
padBottom_16 : Attribute msg
padBottom_16 =
    addClass "ew-pb-16"
