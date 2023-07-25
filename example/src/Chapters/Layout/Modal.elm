module Chapters.Layout.Modal exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import Theme
import W.Button
import W.Container
import W.Modal
import W.Popover
import W.Text


chapter_ : Chapter x
chapter_ =
    let
        wrapper =
            W.Container.view
                [ W.Container.background (Theme.baseAuxWithAlpha 0.07)
                , W.Container.alignCenterY
                , W.Container.alignCenterX
                , W.Container.styleAttrs [ ( "height", "400px" ) ]
                ]

        content =
            W.Container.view
                [ W.Container.fill
                , W.Container.alignLeft
                , W.Container.pad_4
                , W.Container.styleAttrs [ ( "height", "600px" ) ]
                ]
                [ W.Popover.viewNext 
                    [ W.Popover.right, W.Popover.offset 4, W.Popover.width 100 ]
                    { trigger =
                        [ W.Button.viewDummy
                            []
                            [ H.text "Popovers should be usable inside modals" ]
                        ]
                    , content = [ W.Text.view [] [ H.text "This should be visible" ] ]
                    }
                ]
    in
    chapter "Modal"
        |> renderComponentList
            [ ( "Modal"
              , wrapper
                    [ W.Modal.view [ W.Modal.absolute, W.Modal.noBlur ]
                        { isOpen = True
                        , onClose = Nothing
                        , content = [ content ]
                        }
                    ]
              )
            , ( "Modal with onClose"
              , wrapper
                    [ W.Modal.view [ W.Modal.absolute, W.Modal.noBlur ]
                        { isOpen = True
                        , onClose = Just (logAction "onClose")
                        , content = [ content ]
                        }
                    ]
              )
            , ( "Modal with toggle"
              , wrapper
                    [ W.Modal.viewToggable [ W.Modal.absolute, W.Modal.noBlur ]
                        { id = "my-modal"
                        , content = [ content ]
                        }
                    , W.Modal.viewToggle "my-modal"
                        [ W.Button.viewDummy [] [ H.text "Toggle Modal" ] ]
                    ]
              )
            , ( "Modal with toggle + close on background"
              , wrapper
                    [ W.Modal.viewToggableWithAutoClose [ W.Modal.absolute, W.Modal.noBlur ]
                        { id = "my-modal-auto-close"
                        , content = [ content ]
                        }
                    , W.Modal.viewToggle "my-modal-auto-close"
                        [ W.Button.viewDummy [] [ H.text "Toggle Modal" ] ]
                    ]
              )
            ]
