module W.InputTextArea exposing
    ( view
    , placeholder, resizable, rows, autogrow
    , disabled, readOnly
    , required
    , onBlur, onEnter, onFocus
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Styles

@docs placeholder, resizable, rows, autogrow


# States

@docs disabled, readOnly


# Validation Attributes

@docs required


# Actions

@docs onBlur, onEnter, onFocus


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , readOnly : Bool
    , required : Bool
    , resizable : Bool
    , autogrow : Bool
    , rows : Int
    , placeholder : Maybe String
    , onFocus : Maybe msg
    , onBlur : Maybe msg
    , onEnter : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { disabled = False
    , readOnly = False
    , required = False
    , placeholder = Nothing
    , resizable = False
    , autogrow = False
    , rows = 4
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
placeholder : String -> Attribute msg
placeholder v =
    Attribute <| \attrs -> { attrs | placeholder = Just v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
required : Bool -> Attribute msg
required v =
    Attribute <| \attrs -> { attrs | required = v }


{-| -}
resizable : Bool -> Attribute msg
resizable v =
    Attribute <| \attrs -> { attrs | resizable = v }



-- Autogrow strategy based on https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/


{-| -}
autogrow : Bool -> Attribute msg
autogrow v =
    Attribute <| \attrs -> { attrs | autogrow = v }


{-| -}
rows : Int -> Attribute msg
rows v =
    Attribute <| \attrs -> { attrs | rows = v }


{-| -}
onBlur : msg -> Attribute msg
onBlur v =
    Attribute <| \attrs -> { attrs | onBlur = Just v }


{-| -}
onFocus : msg -> Attribute msg
onFocus v =
    Attribute <| \attrs -> { attrs | onFocus = Just v }


{-| -}
onEnter : msg -> Attribute msg
onEnter v =
    Attribute <| \attrs -> { attrs | onEnter = Just v }


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
view :
    List (Attribute msg)
    ->
        { value : String
        , onInput : String -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        resizeStyle : H.Attribute msg
        resizeStyle =
            if attrs.autogrow then
                HA.style "resize" "none"

            else
                WH.stringIf attrs.resizable "vertical" "none"
                    |> HA.style "resize"

        inputAttrs : List (H.Attribute msg)
        inputAttrs =
            attrs.htmlAttributes
                ++ [ HA.class baseClass
                   , HA.class "ew-pt-[10px]"
                   , HA.required attrs.required
                   , HA.disabled attrs.disabled
                   , HA.readonly attrs.readOnly
                   , HA.rows attrs.rows
                   , resizeStyle
                   , HA.value props.value
                   , HE.onInput props.onInput
                   , WH.maybeAttr HA.placeholder attrs.placeholder
                   , WH.maybeAttr HE.onFocus attrs.onFocus
                   , WH.maybeAttr HE.onBlur attrs.onBlur
                   , WH.maybeAttr WH.onEnter attrs.onEnter
                   ]
    in
    if not attrs.autogrow then
        H.textarea inputAttrs []

    else
        H.div
            [ HA.class "ew-grid ew-relative" ]
            [ H.div
                [ HA.attribute "aria-hidden" "true"
                , HA.style "grid-area" "1 / 1 / 2 / 2"
                , HA.class "ew-overflow-hidden ew-whitespace-pre-wrap ew-text-transparent"
                , HA.class "ew-pt-[10px]"
                , HA.class baseClass
                , HA.style "background" "transparent"
                ]
                [ H.text (props.value ++ " ") ]
            , H.textarea
                (inputAttrs
                    ++ [ HA.style "grid-area" "1 / 1 / 2 / 2"
                       , HA.class "ew-overflow-hidden ew-whitespace-pre-wrap"
                       ]
                )
                []
            ]

baseClass : String
baseClass =
    "ew-input ew-appearance-none ew-box-border"
        ++ " ew-relative"
        ++ " ew-w-full ew-min-h-[48px] ew-m-0 ew-py-2 ew-px-3"
        ++ " ew-bg-base-aux/[0.07] ew-border ew-border-solid ew-border-base-aux/30 ew-rounded ew-shadow-none"
        ++ " ew-font-text ew-text-base ew-text-base-fg ew-placeholder-base-aux"
        ++ " ew-transition"
        ++ " ew-outline-0 ew-ring-offset-0 ew-ring-primary-fg/50"
        ++ " disabled:ew-bg-base-aux/[0.25] disabled:ew-border-base-aux/[0.25]"
        ++ " focus:ew-bg-base-bg"
        ++ " focus-visible:ew-border-primary-fg focus-visible-visible:ew-ring"
        ++ " read-only:focus:ew-bg-base-aux/10"

