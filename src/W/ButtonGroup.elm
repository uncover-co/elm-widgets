module W.ButtonGroup exposing
    ( view
    , disabled, highlighted
    , outlined, rounded, small, full
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# States

@docs disabled, highlighted


# Styles

@docs outlined, rounded, small, full


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE



-- Attributes


{-| -}
type Attribute msg a
    = Attribute (Attributes msg a -> Attributes msg a)


type alias Attributes msg a =
    { disabled : a -> Bool
    , highlighted : a -> Bool
    , outlined : Bool
    , rounded : Bool
    , small : Bool
    , full : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes msg a
defaultAttrs =
    { disabled = \_ -> False
    , highlighted = \_ -> False
    , outlined = False
    , rounded = False
    , small = False
    , full = False
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg a) -> Attributes msg a
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs



-- Attributes


{-| -}
disabled : (a -> Bool) -> Attribute msg a
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
highlighted : (a -> Bool) -> Attribute msg a
highlighted v =
    Attribute <| \attrs -> { attrs | highlighted = v }


{-| -}
rounded : Attribute msg a
rounded =
    Attribute <| \attrs -> { attrs | rounded = True }


{-| -}
small : Attribute msg a
small =
    Attribute <| \attrs -> { attrs | small = True }


{-| -}
outlined : Attribute msg a
outlined =
    Attribute <| \attrs -> { attrs | outlined = True }


{-| -}
full : Attribute msg a
full =
    Attribute <| \attrs -> { attrs | full = True }


{-| Attributes applied to the wrapper element.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg a
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg a
noAttr =
    Attribute identity



-- Main


{-| -}
view :
    List (Attribute msg a)
    ->
        { items : List a
        , toLabel : a -> List (H.Html msg)
        , onClick : a -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg a
        attrs =
            applyAttrs attrs_
    in
    H.div
        (attrs.htmlAttributes
            ++ [ HA.class "ew-inline-flex ew-items-center"
               , HA.classList [ ( "ew-w-full", attrs.full ) ]
               ]
        )
        (props.items
            |> List.map
                (\item ->
                    H.button
                        [ HA.class "ew-grow ew-shrink-0 ew-box-border"
                        , HA.class "ew-focusable ew-inline-flex ew-items-center ew-justify-center"
                        , HA.class "ew-m-0 ew-py-0 ew-px-4 ew-border-solid"
                        , HA.class "ew-font-text ew-text-base ew-font-medium ew-leading-0"
                        , HA.class "ew-relative focus:ew-z-10"
                        , HA.class "disabled:ew-pointer-events-none disabled:ew-opacity-60"
                        , HA.class "before:ew-block before:ew-content-[''] before:ew-absolute before:ew-inset-0 before:ew-pointer-events-none"
                        , HA.class "before:ew-z-0 before:ew-transition before:ew-duration-200 before:ew-opacity-0"
                        , HA.class "hover:before:ew-opacity-10 active:before:ew-opacity-20"
                        , HA.classList
                            [ ( "ew-h-[32px]", attrs.small )
                            , ( "ew-h-[40px]", not attrs.small )
                            , ( "first:ew-rounded-l-lg last:ew-rounded-r-lg", not attrs.rounded )
                            , ( "first:ew-rounded-l-[16px] last:ew-rounded-r-[16px]", attrs.rounded && attrs.small )
                            , ( "first:ew-rounded-l-[20px] last:ew-rounded-r-[20px]", attrs.rounded && not attrs.small )
                            , ( "ew-border-0 ew-bg-primary-bg ew-text-primary-aux before:ew-bg-primary-aux", attrs.highlighted item && not attrs.outlined )
                            , ( "ew-border-0 ew-bg-neutral-bg ew-text-neutral-aux before:ew-bg-neutral-aux", not (attrs.highlighted item) && not attrs.outlined )
                            , ( "ew-border-primary-fg ew-text-primary-fg ew-bg-primary-fg/[0.1] before:ew-bg-primary-fg", attrs.highlighted item && attrs.outlined )
                            , ( "ew-border-neutral-fg ew-text-neutral-fg ew-bg-neutral-fg/[0.07] before:ew-bg-neutral-fg", not (attrs.highlighted item) && attrs.outlined )
                            , ( "-ew-mx-px first:ew-ml-0 last:ew-mr-0", attrs.outlined )
                            ]
                        , HA.disabled (attrs.disabled item)
                        , HE.onClick (props.onClick item)
                        ]
                        [ viewInner (props.toLabel item) ]
                )
        )


viewInner : List (H.Html msg) -> H.Html msg
viewInner =
    H.span
        [ HA.class "ew-relative ew-z-10 ew-flex-inline ew-items-center ew-justify-center" ]
