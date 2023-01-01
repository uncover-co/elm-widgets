module W.Table exposing
    ( view
    , column, string, int, float, bool, Column
    , alignRight, alignCenter, width, relativeWidth, largeScreenOnly, columnHtmlAttrs, ColumnAttribute
    , groupBy, groupValue, groupLabel
    , highlight
    , onClick, onMouseEnter, onMouseLeave
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Columns

@docs column, string, int, float, bool, Column


# Column Attributes

@docs alignRight, alignCenter, width, relativeWidth, largeScreenOnly, columnHtmlAttrs, ColumnAttribute


# Groups

@docs groupBy, groupValue, groupLabel


# Table Attributes

@docs highlight


# Actions

@docs onClick, onMouseEnter, onMouseLeave


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Dict
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.InputCheckbox
import W.Internal.Helpers as WH



-- Table Attributes


{-| -}
type Attribute msg a
    = Attribute (Attributes msg a -> Attributes msg a)


type alias Attributes msg a =
    { groupBy : Maybe (a -> String)
    , highlight : a -> Bool
    , onClick : Maybe (a -> msg)
    , onMouseEnter : Maybe (a -> msg)
    , onMouseLeave : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg a) -> Attributes msg a
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg a
defaultAttrs =
    { groupBy = Nothing
    , highlight = \_ -> False
    , onClick = Nothing
    , onMouseEnter = Nothing
    , onMouseLeave = Nothing
    , htmlAttributes = []
    }


{-| -}
groupBy : (a -> String) -> Attribute msg a
groupBy v =
    Attribute (\attrs -> { attrs | groupBy = Just v })


{-| -}
highlight : (a -> Bool) -> Attribute msg a
highlight v =
    Attribute (\attrs -> { attrs | highlight = v })


{-| -}
onMouseEnter : (a -> msg) -> Attribute msg a
onMouseEnter v =
    Attribute (\attrs -> { attrs | onMouseEnter = Just v })


{-| -}
onMouseLeave : msg -> Attribute msg a
onMouseLeave v =
    Attribute (\attrs -> { attrs | onMouseLeave = Just v })


{-| -}
onClick : (a -> msg) -> Attribute msg a
onClick v =
    Attribute (\attrs -> { attrs | onClick = Just v })


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg a
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg a
noAttr =
    Attribute identity



-- Column Attributes


{-| -}
type Column msg a
    = Column (ColumnAttributes msg a)


{-| -}
type ColumnAttribute msg a
    = ColumnAttribute (ColumnAttributes msg a -> ColumnAttributes msg a)


type alias ColumnAttributes msg a =
    { label : String
    , customLabel : Maybe (H.Html msg)
    , alignment : H.Attribute msg
    , width : H.Attribute msg
    , largeScreenOnly : Bool
    , toHtml : a -> H.Html msg
    , toGroup : Maybe (String -> List a -> H.Html msg)
    , htmlAttributes : List (H.Attribute msg)
    }


column_ : ColumnAttributes msg a -> List (ColumnAttribute msg a) -> Column msg a
column_ default attrs =
    Column (List.foldl (\(ColumnAttribute fn) a -> fn a) default attrs)


columnAttrs : String -> (a -> H.Html msg) -> ColumnAttributes msg a
columnAttrs label toHtml =
    { label = label
    , customLabel = Nothing
    , alignment = HA.class "ew-text-left"
    , width = HA.class ""
    , largeScreenOnly = False
    , toHtml = toHtml
    , toGroup = Nothing
    , htmlAttributes = []
    }


columnStyles : ColumnAttributes msg a -> List (H.Attribute msg)
columnStyles attrs =
    [ attrs.alignment
    , attrs.width
    , HA.classList
        [ ( "ew-hidden lg:ew-table-cell", attrs.largeScreenOnly ) ]
    ]


{-| -}
columnHtmlAttrs : List (H.Attribute msg) -> ColumnAttribute msg a
columnHtmlAttrs v =
    ColumnAttribute (\attrs -> { attrs | htmlAttributes = v })


{-| -}
alignRight : ColumnAttribute msg a
alignRight =
    ColumnAttribute (\attrs -> { attrs | alignment = HA.class "ew-text-right" })


{-| -}
alignCenter : ColumnAttribute msg a
alignCenter =
    ColumnAttribute (\attrs -> { attrs | alignment = HA.class "ew-text-center" })


{-| -}
width : Int -> ColumnAttribute msg a
width v =
    ColumnAttribute (\attrs -> { attrs | width = HA.style "width" (pxString v) })


{-| -}
relativeWidth : Float -> ColumnAttribute msg a
relativeWidth v =
    ColumnAttribute (\attrs -> { attrs | width = HA.style "width" (pctString v) })


{-| -}
largeScreenOnly : ColumnAttribute msg a
largeScreenOnly =
    ColumnAttribute (\attrs -> { attrs | largeScreenOnly = True })


{-| -}
groupValue : (String -> List a -> H.Html msg) -> ColumnAttribute msg a
groupValue v =
    ColumnAttribute (\attrs -> { attrs | toGroup = Just v })


{-| -}
groupLabel : ColumnAttribute msg a
groupLabel =
    ColumnAttribute (\attrs -> { attrs | toGroup = Just (\label _ -> H.text label) })



-- View


{-| -}
view : List (Attribute msg a) -> List (Column msg a) -> List a -> H.Html msg
view attrs_ columns data =
    let
        attrs : Attributes msg a
        attrs =
            applyAttrs attrs_

        rows : List (H.Html msg)
        rows =
            case attrs.groupBy of
                Just groupBy_ ->
                    data
                        |> toGroupedRows groupBy_
                        |> List.concatMap
                            (\( k, groupRows ) ->
                                viewGroupHeader k attrs columns groupRows
                                    :: List.map (viewTableRow attrs columns) groupRows
                            )

                Nothing ->
                    List.map (viewTableRow attrs columns) data
    in
    H.table
        (attrs.htmlAttributes
            ++ [ HA.class "ew-table ew-table-fixed ew-indent-0"
               , HA.class "ew-w-full ew-overflow-auto"
               , HA.class "ew-bg-base-bg ew-font-text ew-text-base-fg"
               ]
        )
        [ -- Table Head
          H.thead
            [ HA.class "ew-sticky ew-z-20 ew-top-0 ew-z-10"
            , HA.class "ew-bg-base-bg"
            ]
            [ H.tr [] (List.map viewTableHeaderColumn columns) ]
        , --  Table Body
          H.tbody
            [ WH.maybeAttr HE.onMouseLeave attrs.onMouseLeave ]
            rows
        ]


toGroupedRows : (a -> String) -> List a -> List ( String, List a )
toGroupedRows groupBy_ data =
    data
        |> List.foldl
            (\row acc ->
                let
                    key : String
                    key =
                        groupBy_ row
                in
                Dict.update key
                    (\items ->
                        case items of
                            Just items_ ->
                                Just (items_ ++ [ row ])

                            Nothing ->
                                Just [ row ]
                    )
                    acc
            )
            Dict.empty
        |> Dict.toList


viewGroupHeader : String -> Attributes msg a -> List (Column msg a) -> List a -> H.Html msg
viewGroupHeader label _ columns data =
    H.tr
        [ HA.class "ew-p-0 ew-font-semibold" ]
        (columns
            |> List.map
                (\(Column col) ->
                    H.td
                        (columnStyles col
                            ++ col.htmlAttributes
                            ++ [ HA.class "ew-shrink-0 ew-m-0 ew-break-words" ]
                        )
                        [ col.toGroup
                            |> Maybe.map (\fn -> fn label data)
                            |> Maybe.withDefault (H.text "")
                        ]
                )
        )


viewTableHeaderColumn : Column msg a -> H.Html msg
viewTableHeaderColumn (Column col) =
    H.th
        (columnStyles col
            ++ [ HA.class "ew-m-0 ew-font-semibold ew-text-sm ew-text-base-aux" ]
        )
        [ H.text col.label
        ]


viewTableRow : Attributes msg a -> List (Column msg a) -> a -> H.Html msg
viewTableRow attrs columns datum =
    H.tr
        [ HA.class "ew-p-0"
        , if attrs.highlight datum then
            HA.classList
                [ ( "ew-bg-base-aux/[0.07]", True )
                , ( "hover:ew-bg-base-aux/10", attrs.onClick /= Nothing )
                ]

          else
            HA.classList
                [ ( "hover:ew-bg-base-aux/[0.07]", attrs.onClick /= Nothing )
                ]
        , WH.maybeAttr (\onClick_ -> HE.onClick (onClick_ datum)) attrs.onClick
        , WH.maybeAttr (\onMouseEnter_ -> HE.onMouseEnter (onMouseEnter_ datum)) attrs.onMouseEnter
        ]
        (columns
            |> List.map
                (\(Column col) ->
                    H.td
                        (columnStyles col
                            ++ col.htmlAttributes
                            ++ [ HA.class "ew-shrink-0 ew-m-0 ew-break-words" ]
                        )
                        [ col.toHtml datum ]
                )
        )



-- Column Builders


{-| -}
column :
    List (ColumnAttribute msg a)
    ->
        { label : String
        , content : a -> H.Html msg
        }
    -> Column msg a
column attrs_ props =
    column_
        (columnAttrs props.label props.content)
        attrs_


{-| -}
string :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> String }
    -> Column msg a
string attrs_ props =
    column_
        (columnAttrs props.label (\a -> H.text (props.value a)))
        attrs_


{-| -}
int :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> Int }
    -> Column msg a
int attrs_ props =
    let
        default : ColumnAttributes msg a
        default =
            columnAttrs props.label (\a -> H.text (String.fromInt (props.value a)))
    in
    column_ { default | alignment = HA.class "ew-text-right" } attrs_


{-| -}
float :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> Float }
    -> Column msg a
float attrs_ props =
    let
        default : ColumnAttributes msg a
        default =
            columnAttrs props.label (\a -> H.text (String.fromFloat (props.value a)))
    in
    column_ { default | alignment = HA.class "ew-text-right" } attrs_


{-| -}
bool :
    List (ColumnAttribute msg a)
    -> { label : String, value : a -> Bool }
    -> Column msg a
bool attrs_ props =
    let
        default : ColumnAttributes msg a
        default =
            columnAttrs props.label (\a -> W.InputCheckbox.viewReadOnly [] (props.value a))
    in
    column_ { default | alignment = HA.class "ew-text-right" } attrs_



-- Helpers


pctString : Float -> String
pctString v =
    String.fromFloat (v * 100) ++ "%"


pxString : Int -> String
pxString v =
    String.fromInt v ++ "px"
