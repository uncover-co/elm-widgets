module W.InputTextArea exposing
    ( view
    , resizable, rows, autogrow
    , id, class, disabled, readOnly, required, placeholder, htmlAttrs
    , onBlur, onEnter, onFocus
    , Attribute
    )

{-|

@docs view
@docs resizable, rows, autogrow
@docs id, class, disabled, readOnly, required, placeholder, htmlAttrs
@docs onBlur, onEnter, onFocus
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH
import W.Internal.Input


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , class : String
    , unstyled : Bool
    , disabled : Bool
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
    { id = Nothing
    , class = ""
    , unstyled = False
    , disabled = False
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
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


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
                ++ [ WH.maybeAttr HA.id attrs.id
                   , HA.class attrs.class
                   , HA.classList [ ( W.Internal.Input.areaClass, not attrs.unstyled ) ]
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
                , HA.class attrs.class
                , HA.class "ew-overflow-hidden ew-whitespace-pre-wrap ew-text-transparent"
                , HA.class "ew-pt-[10px]"
                , HA.classList [ ( W.Internal.Input.areaClass, not attrs.unstyled ) ]
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
