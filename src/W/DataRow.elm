module W.DataRow exposing
    ( view
    , header, footer, left, right, href, onClick
    , Attribute
    )

{-|

@docs view
@docs header, footer, left, right, href, onClick
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { footer : Maybe (H.Html msg)
    , header : Maybe (H.Html msg)
    , left : Maybe (H.Html msg)
    , right : Maybe (List (H.Html msg))
    , onClick : Maybe msg
    , href : Maybe String
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { footer = Nothing
    , header = Nothing
    , left = Nothing
    , right = Nothing
    , onClick = Nothing
    , href = Nothing
    }



-- Attributes : Setters


{-| -}
footer : H.Html msg -> Attribute msg
footer v =
    Attribute <| \attrs -> { attrs | footer = Just v }


{-| -}
header : H.Html msg -> Attribute msg
header v =
    Attribute <| \attrs -> { attrs | header = Just v }


{-| -}
left : H.Html msg -> Attribute msg
left v =
    Attribute <| \attrs -> { attrs | left = Just v }


{-| -}
right : List (H.Html msg) -> Attribute msg
right v =
    Attribute <| \attrs -> { attrs | right = Just v }


{-| -}
onClick : msg -> Attribute msg
onClick v =
    Attribute <| \attrs -> { attrs | onClick = Just v }


{-| -}
href : String -> Attribute msg
href v =
    Attribute <| \attrs -> { attrs | href = Just v }


{-| -}
view :
    List (Attribute msg)
    -> List (H.Html msg)
    -> H.Html msg
view attrs_ children =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        main_ =
            case ( attrs.onClick, attrs.href ) of
                ( Just onClick_, _ ) ->
                    H.button
                        [ HA.class "ew ew-focusable ew-data-row-main ew-m-button", HE.onClick onClick_ ]

                ( Nothing, Just href_ ) ->
                    H.a
                        [ HA.class "ew ew-focusable ew-data-row-main ew-m-link", HA.href href_ ]

                _ ->
                    H.div
                        [ HA.class "ew ew-data-row-main" ]
    in
    H.div [ HA.class "ew ew-data-row" ]
        [ main_
            [ WH.maybeHtml (\left_ -> H.div [ HA.class "ew ew-data-row-left" ] [ left_ ]) attrs.left
            , H.div [ HA.class "ew ew-data-row-main-main" ]
                [ WH.maybeHtml (\header_ -> H.div [ HA.class "ew ew-data-row-header" ] [ header_ ]) attrs.header
                , H.div [ HA.class "ew ew-data-row-label" ] children
                , WH.maybeHtml (\footer_ -> H.div [ HA.class "ew ew-data-row-footer" ] [ footer_ ]) attrs.footer
                ]
            ]
        , attrs.right
            |> Maybe.map (\right_ -> H.div [ HA.class "ew ew-data-row-actions" ] right_)
            |> Maybe.withDefault (H.text "")
        ]
