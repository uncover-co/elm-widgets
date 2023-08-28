module W.InputCode exposing
    ( view
    , hiddenCharacters, uppercase
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Styles

@docs hiddenCharacters, uppercase


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Array exposing (Array)
import Html as H
import Html.Attributes as HA
import Html.Events as HE



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { uppercase : Bool
    , hiddenCharacters : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes msg
defaultAttrs =
    { uppercase = False
    , hiddenCharacters = False
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs



-- Attributes : Setters


{-| -}
uppercase : Attribute msg
uppercase =
    Attribute (\attrs -> { attrs | uppercase = True })


{-| -}
hiddenCharacters : Attribute msg
hiddenCharacters =
    Attribute (\attrs -> { attrs | hiddenCharacters = True })


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


{-| -}
view :
    List (Attribute msg)
    ->
        { length : Int
        , value : String
        , onInput : String -> msg
        }
    -> H.Html msg
view attrs_ props =
    if props.length <= 0 then
        H.div [] []

    else
        let
            attrs : Attributes msg
            attrs =
                applyAttrs attrs_

            valueLetters : Array String
            valueLetters =
                props.value
                    |> String.split ""
                    |> List.take props.length
                    |> Array.fromList

            activeIndex : Int
            activeIndex =
                Array.length valueLetters
        in
        H.label
            [ HA.class "ew-group/ew" ]
            [ H.input
                [ HA.class "ew-h-0 ew-p-0 ew-m-0 ew-border-0 ew-opacity-0"
                , HA.value props.value
                , HE.onFocus (props.onInput "")
                , HE.onInput
                    (\v ->
                        let
                            value : String
                            value =
                                String.left props.length v
                        in
                        if attrs.uppercase then
                            value
                                |> String.toUpper
                                |> props.onInput

                        else
                            value
                                |> props.onInput
                    )
                ]
                []
            , H.div
                [ HA.class "ew-flex ew-gap-2" ]
                ((props.length - 1)
                    |> List.range 0
                    |> List.map
                        (\index ->
                            H.div
                                [ HA.class "ew-border-solid ew-border-base-aux/30 ew-border-2"
                                , HA.class "ew-w-10 ew-h-14 ew-rounded-md"
                                , HA.class "ew-flex ew-items-center ew-justify-center"
                                , HA.class "ew-font-heading ew-text-3xl ew-text-base-fg"
                                , HA.classList
                                    [ ( "group-focus-within/ew:ew-border-base-fg"
                                      , index == activeIndex
                                      )
                                    ]
                                ]
                                [ Array.get index valueLetters
                                    |> Maybe.map
                                        (\c ->
                                            if attrs.hiddenCharacters then
                                                "*"

                                            else
                                                c
                                        )
                                    |> Maybe.withDefault ""
                                    |> H.text
                                ]
                        )
                )
            ]
