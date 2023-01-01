module W.DataRow exposing
    ( view, header, footer, left, right
    , href, onClick
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, header, footer, left, right


# Actions

@docs href, onClick


# Html

@docs htmlAttrs, noAttr, Attribute

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
    { footer : Maybe (List (H.Html msg))
    , header : Maybe (List (H.Html msg))
    , left : Maybe (List (H.Html msg))
    , right : Maybe (List (H.Html msg))
    , onClick : Maybe msg
    , href : Maybe String
    , htmlAttributes : List (H.Attribute msg)
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
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
footer : List (H.Html msg) -> Attribute msg
footer v =
    Attribute <| \attrs -> { attrs | footer = Just v }


{-| -}
header : List (H.Html msg) -> Attribute msg
header v =
    Attribute <| \attrs -> { attrs | header = Just v }


{-| -}
left : List (H.Html msg) -> Attribute msg
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


{-| Attributes applied to the parent element.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity


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

        mainAttrs : List (H.Attribute msg)
        mainAttrs =
            [ HA.class "ew-grow ew-flex ew-items-center"
            , HA.class "ew-w-full ew-p-2 ew-bg-transparent"
            , HA.class "ew-btn-like ew-text-base ew-text-left ew-font-text ew-text-base-fg"
            ]

        mainClickableClass : H.Attribute msg
        mainClickableClass =
            HA.class "ew-focusable hover:ew-bg-base-aux/[0.07] active:ew-bg-base-aux/10"

        main_ : List (H.Html msg) -> H.Html msg
        main_ =
            case ( attrs.onClick, attrs.href ) of
                ( Just onClick_, _ ) ->
                    H.button
                        (mainAttrs
                            ++ [ mainClickableClass
                               , HE.onClick onClick_
                               ]
                        )

                ( Nothing, Just href_ ) ->
                    H.a
                        (mainAttrs
                            ++ [ mainClickableClass
                               , HA.href href_
                               ]
                        )

                _ ->
                    H.div mainAttrs
    in
    H.div
        (HA.class "ew-flex ew-items-center ew-p-2 ew-box-border ew-bg-base-bg"
            :: attrs.htmlAttributes
        )
        [ main_
            [ WH.maybeHtml (\left_ -> H.div [ HA.class "ew-shrink-0 ew-px-3 ew-py-2 ew-pl-0" ] left_) attrs.left
            , H.div [ HA.class "ew-grow" ]
                [ WH.maybeHtml (\header_ -> H.div [ HA.class "ew-text-sm ew-text-base-aux ew-pb-1" ] header_) attrs.header
                , H.div [ HA.class "ew ew-data-row-label" ] children
                , WH.maybeHtml (\footer_ -> H.div [ HA.class "ew-text-sm ew-text-base-aux ew-pt-0.5" ] footer_) attrs.footer
                ]
            ]
        , attrs.right
            |> Maybe.map (\right_ -> H.div [ HA.class "ew-shrink-0 ew-pl-2" ] right_)
            |> Maybe.withDefault (H.text "")
        ]
