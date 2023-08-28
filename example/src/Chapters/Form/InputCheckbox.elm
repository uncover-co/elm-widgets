module Chapters.Form.InputCheckbox exposing (..)

import ElmBook.Actions exposing (logActionWithBool)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import W.Container
import W.InputCheckbox


chapter_ : Chapter x
chapter_ =
    chapter "Input Checkbox"
        |> renderComponentList
            [ ( "Default"
              , W.InputCheckbox.view
                    []
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Disabled (Checked)"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.disabled True ]
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Disabled (Unchecked)"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.disabled True ]
                    { value = False
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Read Only"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.readOnly True ]
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Custom Color"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.color "red" ]
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Different Sizes"
              , H.div
                    []
                    [ W.InputCheckbox.view
                        []
                        { value = True
                        , onInput = logActionWithBool "onInput"
                        }
                    , H.div [ HA.style "display" "inline-block", HA.style "width" "8px" ] []
                    , W.InputCheckbox.view
                        [ W.InputCheckbox.small ]
                        { value = True
                        , onInput = logActionWithBool "onInput"
                        }
                    ]
              )
            , ( "Colorful"
              , H.div
                    []
                    [ W.InputCheckbox.view
                        [ W.InputCheckbox.colorful ]
                        { value = False
                        , onInput = logActionWithBool "onInput"
                        }
                    , H.div [ HA.style "display" "inline-block", HA.style "width" "8px" ] []
                    , W.InputCheckbox.view
                        [ W.InputCheckbox.small, W.InputCheckbox.colorful ]
                        { value = False
                        , onInput = logActionWithBool "onInput"
                        }
                    ]
              )
            , ( "Toggle"
              , W.Container.view
                    [ W.Container.card, W.Container.pad_3 ]
                    [ W.InputCheckbox.view
                        [ W.InputCheckbox.toggle ]
                        { value = True
                        , onInput = logActionWithBool "onInput"
                        }
                    ]
              )
            , ( "Toggle (Small)"
              , W.Container.view
                    [ W.Container.card, W.Container.pad_3 ]
                    [ W.InputCheckbox.view
                        [ W.InputCheckbox.toggle, W.InputCheckbox.small ]
                        { value = True
                        , onInput = logActionWithBool "onInput"
                        }
                    ]
              )
            ]
