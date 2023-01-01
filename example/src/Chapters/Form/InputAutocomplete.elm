module Chapters.Form.InputAutocomplete exposing (Model, chapter_, init)

import ElmBook
import ElmBook.Actions exposing (logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import W.InputAutocomplete


type alias Model =
    W.InputAutocomplete.Value Int


init : Model
init =
    W.InputAutocomplete.init
        { value = Nothing
        , toString = String.fromInt
        }


logAction_ : String -> W.InputAutocomplete.Value Int -> ElmBook.Msg x
logAction_ label value =
    W.InputAutocomplete.toValue value
        |> Maybe.map String.fromInt
        |> Maybe.withDefault "Nothing"
        |> logActionWithString label


chapter_ : Chapter { x | autocomplete : Model }
chapter_ =
    chapter "Input Autocomplete"
        |> renderStatefulComponentList
            [ ( "Default"
              , \model ->
                    W.InputAutocomplete.view [ W.InputAutocomplete.placeholder "Search for a number…" ]
                        { id = "autocomplete-default"
                        , value = model.autocomplete
                        , options = Just (List.range 0 10)
                        , onInput = logAction_ "onInput"
                        }
              )
            , ( "Loading"
              , \model ->
                    W.InputAutocomplete.view [ W.InputAutocomplete.placeholder "Fetching some options…" ]
                        { id = "autocomplete-loading"
                        , value = model.autocomplete
                        , options = Nothing
                        , onInput = logAction_ "onInput"
                        }
              )
            , ( "Read Only"
              , \model ->
                    W.InputAutocomplete.view
                        [ W.InputAutocomplete.readOnly True
                        , W.InputAutocomplete.placeholder "You can't touch me"
                        ]
                        { id = "autocomplete-read-only"
                        , value = model.autocomplete
                        , options = Just (List.range 0 10)
                        , onInput = logAction_ "onInput"
                        }
              )
            ]
