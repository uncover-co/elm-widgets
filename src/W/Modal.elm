module W.Modal exposing
    ( view
    , id, absolute
    , Attribute
    )

{-|

@docs view
@docs id, absolute
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH
import W.Internal.Icons



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { id : Maybe String
    , absolute : Bool
    }


applyAttrs : List (Attribute msg) -> Attributes
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes
defaultAttrs =
    { id = Nothing
    , absolute = False
    }


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
absolute : Bool -> Attribute msg
absolute v =
    Attribute <| \attrs -> { attrs | absolute = v }



-- Main


{-| -}
view :
    List (Attribute msg)
    ->
        { onClose : Maybe msg
        , content : H.Html msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes
        attrs =
            applyAttrs attrs_
    in
    H.div
        [ HA.attribute "role" "dialog"
        , HA.class "ew-inset-0 ew-flex ew-flex-col ew-items-center ew-justify-center ew-p-6"
        , HA.classList
            [ ( "ew-absolute", attrs.absolute )
            , ( "ew-fixed", not attrs.absolute )
            ]
        ]
        [ H.div
            [ HA.class "ew-absolute ew-inset-0 ew-opacity-20"
            , HA.style "background" "rgba(0, 0, 0, 0.4)"
            , HA.classList
                [ ( "hover:ew-opacity-[0.15]", props.onClose /= Nothing )
                ]
            , WH.maybeAttr HE.onClick props.onClose
            ]
            []
        , H.div
            [ HA.class "ew-relative"
            , HA.class "ew-bg-base-bg ew-shadow-lg ew-rounded-lg"
            , HA.class "ew-w-full ew-max-w-md ew-max-h-[80%] ew-overflow-auto"
            ]
            [ props.content
            ]
        ]
