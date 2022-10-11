module W.ButtonGroup exposing
    ( view
    , toId, toDisabled, disabled
    , outlined, rounded, small, fill
    , Attribute
    )

{-|

@docs view
@docs toId, toDisabled, disabled
@docs outlined, rounded, small, fill
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import ThemeSpec exposing (ThemeSpecColorVars)
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute a msg
    = Attribute (Attributes a msg -> Attributes a msg)


type alias Attributes a msg =
    { disabled : Bool
    , toId : Maybe (a -> String)
    , toDisabled : a -> Bool
    , outlined : Bool
    , rounded : Bool
    , small : Bool
    , fill : Bool
    , theme : ThemeSpecColorVars
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes a msg
defaultAttrs =
    { disabled = False
    , toId = Nothing
    , toDisabled = \_ -> False
    , outlined = False
    , rounded = False
    , small = False
    , fill = False
    , theme = ThemeSpec.secondary
    , htmlAttributes = []
    }


applyAttrs : List (Attribute a msg) -> Attributes a msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs



-- Attributes


{-| -}
toId : (a -> String) -> Attribute a msg
toId v =
    Attribute <| \attrs -> { attrs | toId = Just v }


{-| -}
disabled : Bool -> Attribute a msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
toDisabled : (a -> Bool) -> Attribute a msg
toDisabled v =
    Attribute <| \attrs -> { attrs | toDisabled = v }


{-| -}
rounded : Attribute a msg
rounded =
    Attribute <| \attrs -> { attrs | rounded = True }


{-| -}
small : Attribute a msg
small =
    Attribute <| \attrs -> { attrs | small = True }


{-| deprecated.
-}
outlined : Attribute a msg
outlined =
    Attribute <| \attrs -> { attrs | outlined = True }


{-| -}
fill : Attribute a msg
fill =
    Attribute <| \attrs -> { attrs | fill = True }



-- Main


{-| -}
view :
    List (Attribute a msg)
    ->
        { items : List a
        , isActive : a -> Bool
        , toLabel : a -> H.Html msg
        , onClick : a -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes a msg
        attrs =
            applyAttrs attrs_
    in
    H.div
        [ HA.class "ew ew-button-group"
        , HA.classList
            [ ( "ew-m-outlined", attrs.outlined )
            , ( "ew-m-rounded", attrs.rounded )
            , ( "ew-m-small", attrs.small )
            , ( "ew-m-fill", attrs.fill )
            ]
        , WH.styles
            [ ( "--bg", attrs.theme.bgChannels )
            , ( "--fg", attrs.theme.fgChannels )
            , ( "--aux", attrs.theme.auxChannels )
            ]
        ]
        (props.items
            |> List.map
                (\item ->
                    H.button
                        [ WH.maybeAttr (\fn -> HA.id (fn item)) attrs.toId
                        , HA.class "ew ew-focusable ew-button-group-item"
                        , HA.classList [ ( "ew-m-active", props.isActive item ) ]
                        , HA.disabled (attrs.disabled || attrs.toDisabled item)
                        , HE.onClick (props.onClick item)
                        ]
                        [ props.toLabel item ]
                )
        )
