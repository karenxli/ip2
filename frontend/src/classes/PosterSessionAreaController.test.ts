import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { PosterSessionArea } from '../generated/client';
import TownController from './TownController';
import PosterSessionAreaController, {
  PosterSessionAreaEvents,
} from './PosterSessionAreaController';

describe('PosterSessionAreaController', () => {
  // A valid PosterSessionArea to be reused within the tests
  let testArea: PosterSessionAreaController;
  let testAreaModel: PosterSessionArea;
  const townController: MockProxy<TownController> = mock<TownController>();
  const mockListeners = mock<PosterSessionAreaEvents>();
  beforeEach(() => {
    testAreaModel = {
      id: nanoid(),
      title: nanoid(),
      imageContents: nanoid(),
      stars: 1,
    };
    testArea = new PosterSessionAreaController(testAreaModel);
    mockClear(townController);
    mockClear(mockListeners.posterImageContentsChange);
    mockClear(mockListeners.posterStarChange);
    mockClear(mockListeners.posterTitleChange);
    testArea.addListener('posterTitleChange', mockListeners.posterTitleChange);
    testArea.addListener('posterImageContentsChange', mockListeners.posterImageContentsChange);
    testArea.addListener('posterStarChange', mockListeners.posterStarChange);
  });

  describe('updateFrom', () => {
    it('Does not update the id property', () => {
      const existingID = testArea.id;
      const newModel: PosterSessionArea = {
        id: nanoid(),
        title: nanoid(),
        imageContents: nanoid(),
        stars: testAreaModel.stars + 1,
      };
      testArea.updateFrom(newModel);
      expect(testArea.id).toEqual(existingID);
    });
  });

  describe('Setting title property', () => {
    it('updates the title property and emits a posterTitleChange event if the property changes', () => {
      const newTitle = nanoid();
      testArea.title = newTitle;
      expect(mockListeners.posterTitleChange).toBeCalledWith(newTitle);
      expect(testArea.title).toEqual(newTitle);
    });
    it('does not emit a posterTitleChange event if the title property does not change', () => {
      testArea.title = `${testAreaModel.title}`;
      expect(mockListeners.posterTitleChange).not.toBeCalled();
    });
  });
  describe('Setting image contents property', () => {
    it('updates the image contents property and emits a posterImageContentsChange event if the property changes', () => {
      const newImageContents = nanoid();
      testArea.imageContents = newImageContents;
      expect(mockListeners.posterImageContentsChange).toBeCalledWith(newImageContents);
      expect(testArea.imageContents).toEqual(newImageContents);
    });
    it('does not emit a image contents event if the image contents property does not change', () => {
      testArea.imageContents = `${testAreaModel.imageContents}`;
      expect(mockListeners.posterImageContentsChange).not.toBeCalled();
    });
  });
  describe('Setting stars property', () => {
    it('updates the stars property and emits a posterStarChange event if the property changes', () => {
      const newStars = 59;
      testArea.stars = newStars;
      expect(mockListeners.posterStarChange).toBeCalledWith(newStars);
      expect(testArea.imageContents).toEqual(newStars);
    });
    it('does not emit a image contents event if the image contents property does not change', () => {
      // eslint-disable-next-line no-self-assign
      testArea.stars = testArea.stars;
      expect(mockListeners.posterImageContentsChange).not.toBeCalled();
    });
  });
  describe('posterSessionAreaModel', () => {
    it('Carries through all of the properties', () => {
      const model = testArea.posterSessionAreaModel();
      expect(model).toEqual(testAreaModel);
    });
  });
});
