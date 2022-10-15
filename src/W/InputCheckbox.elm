module W.InputCheckbox exposing
    ( view
    , id, color, disabled, readOnly
    , Attribute
    )

{-|

@docs view
@docs id, color, disabled, readOnly
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Theme
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { id : Maybe String
    , color : String
    , disabled : Bool
    , readOnly : Bool
    }


applyAttrs : List (Attribute msg) -> Attributes
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes
defaultAttrs =
    { id = Nothing
    , color = Theme.primaryBackground
    , disabled = False
    , readOnly = False
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }



-- Main


{-| -}
view :
    List (Attribute msg)
    -> { value : Bool, onInput : Bool -> msg }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes
        attrs =
            applyAttrs attrs_
    in
    H.input
        [ WH.maybeAttr HA.id attrs.id
        , HA.class "ew-check-radio ew-rounded before:ew-rounded-sm"
        , HA.style "color" attrs.color
        , HA.type_ "checkbox"
        , HA.checked props.value

        -- We also disable the checkbox plugin when it is readonly
        -- Since this property is not currently respected for checkboxes
        , HA.disabled (attrs.disabled || attrs.readOnly)
        , HA.readonly attrs.readOnly

        --
        , HE.onCheck props.onInput
        ]
        []
