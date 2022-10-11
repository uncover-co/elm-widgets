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
        , HA.class "ew ew-modal"
        , HA.classList
            [ ( "ew-m-absolute", attrs.absolute )
            , ( "ew-m-can-close", props.onClose /= Nothing )
            ]
        ]
        [ H.div
            [ HA.class "ew ew-modal-background"
            , WH.maybeAttr HE.onClick props.onClose
            ]
            []
        , WH.maybeHtml
            (\onClose ->
                H.button
                    [ HA.class "ew ew-modal-close"
                    , HE.onClick onClose
                    ]
                    [ W.Internal.Icons.close { size = 24 } ]
            )
            props.onClose
        , H.div
            [ HA.class "ew ew-modal-content"
            ]
            [ props.content
            ]
        ]
