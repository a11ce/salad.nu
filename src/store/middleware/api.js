import * as actions from "./../api";
import { getCourses } from "./../../fakeServices/coursesService";
import { getSection } from "./../../fakeServices/sectionsService";
import { getBuilding } from "./../../fakeServices/buildingsService";

const api = ({ dispatch }) => (next) => async (action) => {
  if (action.type === actions.apiRequested.type) {
    const {
      resource,
      method,
      data,
      onSuccess,
      onError,
      onStart,
      ...rest
    } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {
      let response;
      if (resource === "courses") {
        response = getCourses();
      } else if (resource === "sections") {
        response = getSection(data);
      } else if (resource === "buildings") {
        response = getBuilding(data);
      }

      dispatch(actions.apiSuccess(response));

      if (onSuccess)
        dispatch({ type: onSuccess, payload: { data: response, ...rest } });
    } catch (error) {
      dispatch(actions.apiFailed(error.message));

      if (onError) dispatch({ type: onError, payload: error.message });
    }
  } else next(action);
};

export default api;